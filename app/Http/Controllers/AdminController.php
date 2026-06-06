<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Team;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function approvePayment($paymentId)
    {
        $payment = Payment::find($paymentId);
        if ($payment) {
            // Ubah status pembayaran jadi approved
            $payment->update(['status' => 'approved']);

            // Ubah status Tim terkait menjadi paid secara otomatis
            $team = Team::find($payment->team_id);
            if ($team) {
                $team->update(['status' => 'paid']);
            }

            return redirect()->back()->with('success', 'Pembayaran dan status tim berhasil disetujui!');
        }

        return redirect()->back()->with('error', 'Data gagal diproses.');
    }
}