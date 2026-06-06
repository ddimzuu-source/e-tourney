<?php

namespace App\Http\Controllers;

use App\Models\Tournament;

class PesertaTournamentController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::all();

        return view('peserta.tournaments.index', compact('tournaments'));
    }

    public function bracket($id)
    {
        $tournament = Tournament::findOrFail($id);

        return view('peserta.tournaments.bracket', compact('tournament'));
    }
}
