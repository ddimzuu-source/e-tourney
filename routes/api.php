<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BracketController;


Route::post('/register', [App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);


Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/dashboard/recent-registrations', [DashboardController::class, 'recentRegistrations']);

Route::get('/tournaments/{id}/bracket', [App\Http\Controllers\Api\TournamentController::class, 'getBracket']);
Route::apiResource('tournaments', TournamentController::class);
Route::apiResource('teams', TeamController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('users', UserController::class);

Route::get('/tournaments/{id}/bracket', [BracketController::class, 'show']);
Route::post('/tournaments/{id}/bracket/generate', [BracketController::class, 'generate']);
Route::put('/brackets/{bracketId}/match/{roundIndex}/{matchIndex}', [BracketController::class, 'updateMatch']);