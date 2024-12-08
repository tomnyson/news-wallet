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

    // Store a new transaction
    public function store(Request $request)
{
    try {
        // Validate the request data
        $validatedData = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'transaction_id' => 'required|string|unique:transactions',
            'amount' => 'required|numeric',
            'status' => 'required|string|in:pending,completed,failed',
            'method' => 'required|string|in:stripe,paypal,google_pay',
        ]);

        $currentId = Auth::user()->id;

        // Find the user's wallet
        $wallet = Wallet::where('user_id', $currentId)->firstOrFail();
        // If the wallet does not exist, create it with a balance of 0
        if (!$wallet) {
            $wallet = Wallet::create([
            'user_id' => $currentId,
            'balance' => 0,
            ]);
        }
        $package = Package::findOrFail($validatedData['package_id']);

        // Create transaction data
        $dataTransactions = [
            'user_id' => $currentId,
            'amount' => $validatedData['amount'],
            'type' => $validatedData['status'],
            'method' => $validatedData['method'],
            'transaction_id' => $validatedData['transaction_id'],
        ];

        // Create the transaction
        $transaction = Transaction::create($dataTransactions);

        // Update wallet balance
        $wallet->balance += $validatedData['amount'];
        $wallet->save();

        // Calculate subscription expiration
        $expiresAt = now()->addDays($package->duration);

        // Create subscription data
        $dataSubscriptions = [
            'user_id' => $currentId,
            'package_id' => $validatedData['package_id'],
            'expires_at' => $expiresAt,
        ];

        // Create the subscription
        $subscription = Subscription::create($dataSubscriptions);

        // Deduct package price from the wallet balance
        $wallet->balance -= $package->price;
        $wallet->save();

        return response()->json([
            'message' => 'Transaction created successfully',
            'data' => $transaction,
        ], 201);
    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Resource not found',
            'error' => $e->getMessage(),
        ], 404);
    } catch (Exception $e) {
        return response()->json([
            'message' => 'An error occurred while processing the transaction',
            'error' => $e->getMessage(),
        ], 500);
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
}