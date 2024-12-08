<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Auth;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/posts-user', [PostController::class, 'getPosts']);

// Route::post('/wallet/top-up', [WalletController::class, 'topUp']);

Route::middleware('auth:sanctum')->group(function () {
    try {
        Route::post('/logout', [AuthController::class, 'logout']);
        // Add additional protected routes here
        Route::get('/current-user', [UserController::class, 'currentUser']);
        Route::apiResource('packages', PackageController::class);
        Route::apiResource('posts', PostController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('tags', TagController::class);
        Route::apiResource('users', UserController::class);
        Route::apiResource('transactions', TransactionController::class);
        Route::post('/payment-sheet', [PaymentController::class, 'createPaymentSheet']);
        Route::post('/payment-sheet-googlepay', [PaymentController::class, 'createPaymentSheetGoogle']);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Unauthorized'], 403);
    }
   
});
