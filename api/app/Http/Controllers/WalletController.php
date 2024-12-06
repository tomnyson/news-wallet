<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Wallet;
use App\Models\Transaction;
class WalletController extends Controller
{
    
    public function topUp(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'method' => 'required|string|in:stripe,google_pay',
        ]);

        $user = $request->user();

        // Simulate a successful payment process
        $wallet = Wallet::firstOrCreate(['user_id' => $user->id]);
        $wallet->balance += $request->amount;
        $wallet->save();

        Transaction::create([
            'user_id' => $user->id,
            'amount' => $request->amount,
            'type' => 'top-up',
            'method' => $request->method,
        ]);

        return response()->json(['message' => 'Top-up successful', 'balance' => $wallet->balance]);
    }
}
