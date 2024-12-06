<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\Wallet;
use App\Models\Subscription;

class SubscriptionController extends Controller
{
    public function buy(Request $request)
{
    $request->validate(['package_id' => 'required|exists:packages,id']);

    $user = $request->user();
    $package = Package::findOrFail($request->package_id);

    $wallet = Wallet::where('user_id', $user->id)->firstOrFail();

    if ($wallet->balance < $package->price) {
        return response()->json(['message' => 'Insufficient wallet balance'], 400);
    }

    // Deduct balance and create subscription
    $wallet->balance -= $package->price;
    $wallet->save();

    $expiresAt = now()->addDays($package->duration);

    Subscription::create([
        'user_id' => $user->id,
        'package_id' => $package->id,
        'expires_at' => $expiresAt,
    ]);

    return response()->json(['message' => 'Subscription purchased successfully', 'expires_at' => $expiresAt]);
}
}
