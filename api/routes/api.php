<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\PaymentController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::apiResource('posts', PostController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('tags', TagController::class);
// Route::post('/wallet/top-up', [WalletController::class, 'topUp']);
Route::post('/payment-sheet', [PaymentController::class, 'createPaymentSheet']);
Route::post('/payment-sheet-googlepay', [PaymentController::class, 'createPaymentSheetGoogle']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    // Add additional protected routes here
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
