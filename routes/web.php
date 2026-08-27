<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\MutationApplicationController;
use App\Http\Controllers\MutationLetterController;

// Public Landing Page & Status Checker
Route::get('/', [LandingController::class, 'index'])->name('home');
Route::post('/api/check-status', [LandingController::class, 'checkStatus'])->name('status.check');

// Public QR Code Verification Route
Route::get('/verify-letter/{hash}', [MutationLetterController::class, 'verifyPublic'])->name('letter.verify');

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Mutation Applications
    Route::get('/mutation', [MutationApplicationController::class, 'index'])->name('mutation.index');
    Route::get('/mutation/create', [MutationApplicationController::class, 'create'])->name('mutation.create');
    Route::post('/mutation', [MutationApplicationController::class, 'store'])->name('mutation.store');
    Route::get('/mutation/{id}', [MutationApplicationController::class, 'show'])->name('mutation.show');
    Route::post('/mutation/{id}/verify', [MutationApplicationController::class, 'verify'])->name('mutation.verify');
    Route::post('/mutation/{id}/update', [MutationApplicationController::class, 'update'])->name('mutation.update');
    Route::get('/document/{id}/download', [MutationApplicationController::class, 'downloadDocument'])->name('document.download');
    Route::get('/document/{id}/view', [MutationApplicationController::class, 'viewDocument'])->name('document.view');

    // Mutation Letter Issuance & Download
    Route::post('/mutation/{id}/issue-letter', [MutationLetterController::class, 'issue'])->name('mutation.issue_letter');
    Route::get('/mutation/{id}/download-letter', [MutationLetterController::class, 'download'])->name('mutation.download_letter');
});
