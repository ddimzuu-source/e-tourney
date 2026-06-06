<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\MatchModel;


class TournamentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tournaments = Tournament::latest()->get();

        return view('admin.tournaments.index', compact('tournaments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.tournaments.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'game' => 'required',
            'max_teams' => 'required',
            'start_date' => 'required',
        ]);

        // CREATE TO CHALLONGE
        $response = Http::withBasicAuth(
            env('CHALLONGE_USERNAME'),
            env('CHALLONGE_API_KEY')
        )->post('https://api.challonge.com/v1/tournaments.json', [
            'tournament' => [
                'name' => $request->name,
                'url' => strtolower(str_replace(' ', '_', $request->name)) . time(),
                'tournament_type' => 'single elimination',
            ]
        ]);

        $challonge = $response->json();

        Tournament::create([
            'name' => $request->name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'max_teams' => $request->max_teams,
            'game' => $request->game,

            // SIMPAN URL CHALLONGE
            'challonge_id' => $challonge['tournament']['url'] ?? null,
        ]);

        return redirect('/tournaments');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tournament $tournament)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tournament $tournament)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tournament $tournament)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tournament $tournament)
    {
        $tournament->delete();

        return back();
    }

    public function testChallonge()
    {
        $response = Http::withBasicAuth(
            env('CHALLONGE_USERNAME'),
            env('CHALLONGE_API_KEY')
        )->post('https://api.challonge.com/v1/tournaments.json', [
            'tournament' => [
                'name' => 'Test Tournament',
                'url' => 'test_' . time(),
                'tournament_type' => 'single elimination',
            ]
        ]);

        dd(
            $response->status(),
            $response->json()
        );
    }
    public function generateBracket($id)
    {
        $tournament = Tournament::findOrFail($id);

        $teams = Team::where('tournament_id', $id)
            ->where('status', 'paid')
            ->get();

        // ADD PARTICIPANTS
        foreach ($teams as $team) {

            $response = Http::withBasicAuth(
                env('CHALLONGE_USERNAME'),
                env('CHALLONGE_API_KEY')
            )->post(
                "https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}/participants.json",
                [
                    'participant' => [
                        'name' => $team->name
                    ]
                ]
            );

            dump($team->name);
            dump($response->status());
            dump($response->json());
        }

        // START TOURNAMENT
        Http::withBasicAuth(
            env('CHALLONGE_USERNAME'),
            env('CHALLONGE_API_KEY')
        )->post(
            "https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}/start.json"
        );

        return redirect()->away(
            "https://challonge.com/" . $tournament->challonge_id
        );
    }

    public function showBracket($id)
    {
        $tournament = Tournament::findOrFail($id);

        return view('admin.tournaments.bracket', compact('tournament'));
    }

    public function localBracket($id)
    {
        $matches = MatchModel::where('tournament_id', $id)
            ->orderBy('round')
            ->get();

        return view('admin.tournaments.local-bracket', compact('matches'));
    }

    public function saveScore(Request $request, $id)
    {
        $match = MatchModel::findOrFail($id);

        $winner = null;

        if ($request->score1 > $request->score2) {
            $winner = $match->team1;
        } else {
            $winner = $match->team2;
        }

        $match->update([
            'score1' => $request->score1,
            'score2' => $request->score2,
            'winner' => $winner,
        ]);

        return back();
    }

    public function pesertaIndex()
    {
        $tournaments = Tournament::all();

        return view('peserta.tournaments.index', compact('tournaments'));
    }
}
