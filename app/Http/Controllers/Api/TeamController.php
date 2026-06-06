<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $teams = Team::orderBy('created_at', 'desc')->get();
        return response()->json($teams);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string',
            'tournament_id' => 'required|numeric',
            'captain_id'    => 'required|string',
            'members'       => 'required|array',
        ]);

        $validated['status'] = 'pending';
        $validated['registered_at'] = now();

        $team = Team::create($validated);

        return response()->json($team, 201);
    }

    public function show(string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        return response()->json($team);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team->update($request->all());
        return response()->json($team);
    }

    public function destroy(string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        $team->delete();
        return response()->json(['message' => 'Team deleted']);
    }
}