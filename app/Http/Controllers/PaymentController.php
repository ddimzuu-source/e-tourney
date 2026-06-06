<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Team;
use Illuminate\Http\Request;
use App\Models\Tournament;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('team')->get();

        return view('admin.payments.index', compact('payments'));
    }
    public function create()
    {
        $tournaments = Tournament::all();

        return view('admin.payments.create', compact('tournaments'));
    }

    public function store(Request $request)
    {
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
        return redirect('/payments');
    }

    public function approve($id)
    {
        $payment = Payment::findOrFail($id);

        $payment->status = 'approved';
        $payment->save();

        $payment->team->status = 'paid';
        $payment->team->save();

        return back();
    }
    public function reject($id)
    {
        $payment = Payment::findOrFail($id);

        $payment->status = 'rejected';
        $payment->save();

        return redirect('/payments');
    }

    public function pesertaIndex()
    {
        $payments = Payment::with('team', 'team.tournament')->get();

        return view('peserta.pendaftaran.index', compact('payments'));
    }
}
