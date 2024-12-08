<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Customer;
use Stripe\EphemeralKey;
use Stripe\PaymentIntent;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function createPaymentSheet(Request $request)
    {
        try {
            // Ensure API version is loaded correctly
            $apiVersion = env('STRIPE_API_VERSION');
            if (!$apiVersion) {
                throw new \Exception('Stripe API version is not set in .env');
            }

            // Set Stripe API key and version
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
            \Stripe\Stripe::setApiVersion($apiVersion);

            $customer = \Stripe\Customer::create([
               'description' => 'Customer for payment sheet - ' . Auth::user()->name, // Include user name in description
                'email' => Auth::user()->email, // Include user email
            ]);

            // Step 2: Create an Ephemeral Key
            try {
                $ephemeralKey = \Stripe\EphemeralKey::create(
                    ['customer' => $customer->id],
                    ['stripe_version' => $apiVersion]
                );
            } catch (\Exception $e) {
                throw new \Exception('Error creating ephemeral key: ' . $e->getMessage());
            }
            $validate = $request->validate( [
                'currency' => 'required|string',
                'price' => 'nullable|integer', // Minimum amount in cents (50 cents = $0.50)
            ]);

            // Step 3: Create a Payment Intent
            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => $validate['price']*100, // Amount in cents (e.g., $50.00)
                'currency' => 'usd', // Change currency if needed
                'customer' => $customer->id,
                'automatic_payment_methods' => [
                    'enabled' => true, // Enable automatic payment methods
                ],
            ]);

            // Step 4: Return the Client Secret and other details
            return response()->json([
                'paymentIntent' => $paymentIntent->client_secret,
                'ephemeralKey' => $ephemeralKey->secret,
                'customer' => $customer->id,
            ]);
        } catch (\Exception $e) {
            // Handle exceptions and return error messages
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function createPaymentSheetGoogle(Request $request)
    {
        try {
            // Set the Stripe secret key and API version
            Stripe::setApiKey(env('STRIPE_SECRET'));
            Stripe::setApiVersion(env('STRIPE_API_VERSION'));

            // Validate request
            $request->validate([
                'currency' => 'required|string',
                'amount' => 'nullable|integer|min:50', // Minimum amount in cents (50 cents = $0.50)
            ]);

            // Create a Payment Intent
            $paymentIntent = PaymentIntent::create([
                'amount' => $request->input('amount', 5000), // Default to $50.00
                'currency' => $request->input('currency', 'usd'),
                'automatic_payment_methods' => [
                    'enabled' => true, // Enables Google Pay and other payment methods
                ],
            ]);

            // Return the client secret
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
