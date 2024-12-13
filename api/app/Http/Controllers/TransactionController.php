<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Transaction;
use App\Models\Subscription;
use App\Models\Wallet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;


class TransactionController extends Controller
{
    // List all transactions
    public function index()
    {
        $userId = request()->query('user_id');
        if ($userId) {
            $transactions = Transaction::where('user_id', $userId)->get();
        } else {
            $transactions = Transaction::all();
        }
        return response()->json($transactions);
    }

    // Get a specific transaction
    public function show($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        return response()->json($transaction);
    }

    public function buySubscriptions(Request $request)
    {
        try {
            // Validate the incoming request
            $validatedData = $request->validate([
                'package_id' => 'required|numeric',
            ]);

            // Fetch the package details
            $package = Package::findOrFail($validatedData['package_id']);

            // Get the authenticated user's wallet
            $wallet = Wallet::where('user_id', Auth::id())->firstOrFail();

            // Check for sufficient balance
            if ($wallet->balance < $package->price) {
                return response()->json([
                    'message' => 'Insufficient balance',
                ], 400);
            }

            // Deduct package price from wallet balance
            $wallet->balance -= $package->price;
            $wallet->save();

            // Create subscription data
            $subscription = Subscription::create([
                'user_id' => Auth::id(),
                'package_id' => $package->id,
                'transaction_id' => $request->input('transaction_id'),
                'expires_at' => now()->addDays($package->duration),
            ]);

            // Return success response
            return response()->json([
                'message' => 'Subscription created successfully',
                'data' => $subscription,
            ], 201);
        } catch (ValidationException $e) {
            return $this->handleException($e, 'Validation failed', 422);
        } catch (ModelNotFoundException $e) {
            return $this->handleException($e, 'Resource not found', 404);
        } catch (Exception $e) {
            return $this->handleException($e, 'An error occurred while processing the transaction', 500);
        }
    }

    private function handleException(Exception $exception, string $message, int $statusCode)
    {
        return response()->json([
            'message' => $message,
            'error' => $exception->getMessage(),
        ], $statusCode);
    }


    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $this->validateTransactionData($request);

            // Get or create the user's wallet
            $wallet = $this->getOrCreateWallet(Auth::id());

            // Create the transaction
            $transaction = $this->createTransaction($validatedData, Auth::id());

            // Update the wallet balance
            $this->updateWalletBalance($wallet, $validatedData['amount']);

            return response()->json([
                'message' => 'Transaction created successfully',
                'data' => $transaction,
            ], 201);
        } catch (ValidationException $e) {
            return $this->handleValidationException($e);
        } catch (ModelNotFoundException $e) {
            return $this->handleModelNotFoundException($e);
        } catch (Exception $e) {
            return $this->handleGeneralException($e);
        }
    }

    // Update an existing transaction
    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $validatedData = $request->validate([
            'status' => 'string|in:pending,completed,failed',
        ]);

        $transaction->update($validatedData);

        return response()->json([
            'message' => 'Transaction updated successfully',
            'data' => $transaction,
        ]);
    }

    // Delete a transaction
    public function destroy($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $transaction->delete();

        return response()->json(['message' => 'Transaction deleted successfully']);
    }

    /**
     * Validate the transaction data from the request.
     */
    private function validateTransactionData(Request $request)
    {
        return $request->validate([
            'transaction_id' => 'required|string|unique:transactions',
            'amount' => 'required|numeric',
            'status' => 'required|string|in:pending,completed,failed',
            'method' => 'required|string|in:stripe,paypal,google_pay',
        ]);
    }

    /**
     * Get or create a wallet for the given user ID.
     */
    private function getOrCreateWallet($userId)
    {
        return Wallet::firstOrCreate(
            ['user_id' => $userId],
            ['balance' => 0]
        );
    }

    /**
     * Create a transaction record.
     */
    private function createTransaction(array $validatedData, $userId)
    {
        return Transaction::create([
            'user_id' => $userId,
            'amount' => $validatedData['amount'],
            'type' => $validatedData['status'],
            'method' => $validatedData['method'],
            'transaction_id' => $validatedData['transaction_id'],
        ]);
    }

    /**
     * Update the wallet balance.
     */
    private function updateWalletBalance(Wallet $wallet, $amount)
    {
        $wallet->increment('balance', $amount);
    }

    /**
     * Handle validation exceptions.
     */
    private function handleValidationException(ValidationException $e)
    {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    }

    /**
     * Handle model not found exceptions.
     */
    private function handleModelNotFoundException(ModelNotFoundException $e)
    {
        return response()->json([
            'message' => 'Resource not found',
            'error' => $e->getMessage(),
        ], 404);
    }

    /**
     * Handle general exceptions.
     */
    private function handleGeneralException(Exception $e)
    {
        return response()->json([
            'message' => 'An error occurred while processing the transaction',
            'error' => $e->getMessage(),
        ], 500);
    }
}
