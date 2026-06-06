<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::whereHas('payments', function ($query) {
            $query->where('status', 'approved');
        })->with('tournament')->get();

        return view('teams.index', compact('teams'));
    }

    public function create()
    {
        $tournaments = Tournament::all();

        return view('teams.create', compact('tournaments'));
    }

    public function store(Request $request)
    {
        $team = Team::create([
            'name' => $request->name,
            'tournament_id' => $request->tournament_id
        ]);

        return redirect('/payments/create?team_id=' . $team->id);
    }

    public function edit(Team $team)
    {
        $tournaments = Tournament::all();

        return view('teams.edit', compact('team', 'tournaments'));
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'required',
            'tournament_id' => 'required'
        ]);

        $team->update([
            'name' => $request->name,
            'tournament_id' => $request->tournament_id
        ]);

        return redirect('/teams');
    }
}
