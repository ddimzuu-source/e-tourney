<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TournamentController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController;

// Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/me', [AuthController::class, 'me']);

// Dashboard
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
Route::get('/dashboard/recent-registrations', [DashboardController::class, 'recentRegistrations']);

// Resources - public untuk presentasi
Route::apiResource('tournaments', TournamentController::class);
Route::apiResource('teams', TeamController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('users', UserController::class);