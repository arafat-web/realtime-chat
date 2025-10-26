<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Category routes
    Route::apiResource('categories', CategoryController::class);

    // Ticket routes
    Route::apiResource('tickets', TicketController::class);

    // Comment routes
    Route::get('/tickets/{ticket}/comments', [CommentController::class, 'index']);
    Route::post('/tickets/{ticket}/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Message routes (real-time chat)
    Route::get('/tickets/{ticket}/messages', [MessageController::class, 'index']);
    Route::post('/tickets/{ticket}/messages', [MessageController::class, 'store']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
});
