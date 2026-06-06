<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PesertaPendaftaranController extends Controller
{
    public function index()
    {
        $payments = Payment::with('team.tournament')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return view('peserta.pendaftaran.index', compact('payments'));
    }

    public function create(Request $request)
    {
        $tournament = Tournament::findOrFail($request->tournament);

        return view('peserta.pendaftaran.create', compact('tournament'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'team_name' => 'required',
            'tournament_id' => 'required',
            'payment_method' => 'required',
            'proof' => 'required|image'
        ]);

        $team = Team::create([
            'name' => $request->team_name,
            'tournament_id' => $request->tournament_id
        ]);

        $proof = $request->file('proof')->store('payments', 'public');

        Payment::create([
            'user_id' => Auth::id(),
            'team_id' => $team->id,
            'payment_method' => $request->payment_method,
            'proof' => $proof,
            'status' => 'pending'
        ]);

        return redirect('/peserta/pendaftaran');
    }
}