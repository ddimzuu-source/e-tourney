<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BracketController;

// ── Public Routes ────────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Turnamen bisa dilihat tanpa login (untuk landing page)
Route::get('/tournaments',              [TournamentController::class, 'index']);
Route::get('/tournaments/{id}',         [TournamentController::class, 'show']);
Route::get('/tournaments/{id}/bracket', [BracketController::class, 'show']);

// ── Authenticated Routes (Semua yang login, termasuk Peserta) ────────────────
Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Rute tim & payment untuk peserta (akan difilter di controller berdasarkan kepemilikan)
    Route::get('/teams',         [TeamController::class, 'index']);
    Route::post('/teams',        [TeamController::class, 'store']);
    Route::get('/teams/{id}',    [TeamController::class, 'show']);

    Route::get('/payments',      [PaymentController::class, 'index']);
    Route::post('/payments',     [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
    
    // ⬇️ TAMBAHAN: Route khusus untuk upload bukti transfer ke Supabase oleh peserta
    Route::post('/payments/upload-proof', [PaymentController::class, 'uploadProof']);
});

// ── Admin & Panitia Only Routes (Staf & Pengelola) ───────────────────────────
Route::middleware(['auth:api', 'role:admin,panitia'])->group(function () {

    // Dashboard stats
    Route::get('/dashboard/stats',                [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-registrations', [DashboardController::class, 'recentRegistrations']);

    // Tournament CRUD (hanya staf yang bisa mengelola turnamen)
    Route::post('/tournaments',              [TournamentController::class, 'store']);
    Route::put('/tournaments/{id}',          [TournamentController::class, 'update']);
    Route::patch('/tournaments/{id}',        [TournamentController::class, 'update']);
    Route::delete('/tournaments/{id}',       [TournamentController::class, 'destroy']);

    // Bracket generate & update (admin/panitia)
    Route::post('/tournaments/{id}/bracket/generate',                  [BracketController::class, 'generate']);
    Route::put('/brackets/{bracketId}/match/{roundIndex}/{matchIndex}', [BracketController::class, 'updateMatch']);

    // Persetujuan tim & pembayaran (Approval / Deny)
    Route::put('/teams/{id}',      [TeamController::class, 'update']);
    Route::patch('/teams/{id}',    [TeamController::class, 'update']);
    Route::delete('/teams/{id}',   [TeamController::class, 'destroy']);

    Route::put('/payments/{id}',   [PaymentController::class, 'update']);
    Route::patch('/payments/{id}', [PaymentController::class, 'update']);
    Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);
});

// ── Admin Only Routes (Super Admin) ──────────────────────────────────────────
Route::middleware(['auth:api', 'role:admin'])->group(function () {
    // Pengelolaan User Sistem
    Route::apiResource('users', UserController::class);
});