<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use App\Models\Team;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $totalTournaments = Tournament::count();
        $totalTeams = Team::count();
        $totalUsers = User::count();
        $totalRevenue = Payment::where('status', 'paid')->sum('amount');

        return response()->json([
            'total_tournaments' => $totalTournaments,
            'total_teams' => $totalTeams,
            'total_users' => $totalUsers,
            'total_revenue' => $totalRevenue,
        ]);
    }

    public function recentRegistrations(): JsonResponse
    {
        $registrations = Team::with('tournament')
            ->orderBy('created_at', 'desc')
            ->limit(7)
            ->get();

        return response()->json($registrations);
    }
}