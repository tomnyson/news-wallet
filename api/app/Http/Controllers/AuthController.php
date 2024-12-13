<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\TransportException;
use Illuminate\Validation\ValidationException;
class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $role = $request->input('role', 'user');
            $validatedData = $request->validate([
                    'name' => 'required|string|max:255',
                    'email' => 'required|string|email|max:255|unique:users',
                    'password' => 'required|string|min:8|confirmed',
                  
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => $role,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token', ['*'], now()->addDays(1))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }


    public function forgotPassword(Request $request)
{
    try {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        $newPassword = Str::random(8);

        $user->password = bcrypt($newPassword);
        $user->save();

        Mail::send('emails.forgot_password', ['password' => $newPassword, 'name'=> $user->name], function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Your New Password');
        });

        return response()->json(['message' => 'New password sent to your email address.'], 200);

    } catch (ValidationException $e) {
        return response()->json(['error' => $e->errors()], 422);
    }  catch (\Exception $e) {
        return response()->json(['error' => 'An unexpected error occurred. Please try again later.'], 500);
    }
}
    public function checkToken(Request $request) {
        return response()->json(['message' => 'Token is valid'], 200);
    }

    public function refreshToken(Request $request) {
        $user = $request->user();
        $token = $user->createToken('auth_token', ['*'], now()->addDays(1))->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }
    
}
