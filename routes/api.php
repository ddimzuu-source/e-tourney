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

// ── Authenticated Routes ─────────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Dashboard stats
    Route::get('/dashboard/stats',                [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-registrations', [DashboardController::class, 'recentRegistrations']);

    // Tournament CRUD (butuh login untuk create/update/delete)
    Route::post('/tournaments',              [TournamentController::class, 'store']);
    Route::put('/tournaments/{id}',          [TournamentController::class, 'update']);
    Route::patch('/tournaments/{id}',        [TournamentController::class, 'update']);
    Route::delete('/tournaments/{id}',       [TournamentController::class, 'destroy']);

    // Bracket generate & update (admin/panitia)
    Route::post('/tournaments/{id}/bracket/generate',                    [BracketController::class, 'generate']);
    Route::put('/brackets/{bracketId}/match/{roundIndex}/{matchIndex}', [BracketController::class, 'updateMatch']);

    // Teams, Payments, Users
    Route::apiResource('teams',    TeamController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('users',    UserController::class);
});