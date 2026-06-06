<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TournamentController extends Controller
{
    public function index(): JsonResponse
    {
        $tournaments = Tournament::orderBy('created_at', 'desc')->get();
        return response()->json($tournaments);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'             => 'required|string',
            'game'             => 'required|string',
            'game_tag'         => 'required|string',
            'max_teams'        => 'required|integer',
            'registration_fee' => 'required|numeric',
            'prize'            => 'required|string',
            'start_date'       => 'required|string',
            'status'           => 'required|in:open,registration,ongoing,finished',
        ]);

        $validated['slots_used'] = 0;
        $tournament = Tournament::create($validated);

        return response()->json($tournament, 201);
    }

    public function show(string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
        return response()->json($tournament);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->update($request->all());
        return response()->json($tournament);
    }

    public function destroy(string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
        $tournament->delete();
        return response()->json(['message' => 'Tournament deleted']);
    }
}