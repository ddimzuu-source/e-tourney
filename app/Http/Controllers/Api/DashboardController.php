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
        $registrations = Team::orderBy('created_at', 'desc')
            ->limit(7)
            ->get()
            ->map(function ($team) {
                $tournament = \App\Models\Tournament::find($team->tournament_id);
                return [
                    '_id'           => (string) $team->_id,
                    'name'          => $team->name,
                    'tournament_id' => $tournament?->name ?? $team->tournament_id,
                    'registered_at' => $team->registered_at ?? $team->created_at,
                ];
            });

        return response()->json($registrations);
    }
}