<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// Guest routes - redirect to dashboard (or login if not authenticated)
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Tickets
    Route::resource('tickets', TicketController::class);

    // Comments (nested under tickets)
    Route::post('/tickets/{ticket}/comments', [CommentController::class, 'store'])
        ->name('tickets.comments.store');

    // Messages (nested under tickets - for real-time chat)
    Route::post('/tickets/{ticket}/messages', [MessageController::class, 'store'])
        ->name('tickets.messages.store');

    // Categories (admin only - authorization checked in controller)
    Route::resource('categories', CategoryController::class);

    // Profile management (from Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Authentication routes (from Breeze)
require __DIR__.'/auth.php';
