<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Team;
 
class PaymentController extends Controller
{
    // GET /api/payments
    public function index()
    {
        $user = auth('api')->user();
 
        if (in_array($user?->role, ['admin', 'panitia'])) {
            $payments = Payment::orderBy('created_at', 'desc')->get();
        } else {
            $teamIds = Team::where('captain_id', (string) $user?->id)
                           ->get()
                           ->map(fn($t) => (string) $t->id)
                           ->toArray();
 
            $payments = Payment::whereIn('team_id', $teamIds)
                               ->orderBy('created_at', 'desc')
                               ->get();
        }
 
        return response()->json($payments);
    }
 
    // GET /api/payments/{id}
    public function show($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment tidak ditemukan.'], 404);
        }
        return response()->json($payment);
    }
 
    // POST /api/payments
    public function store(Request $request)
    {
        $request->validate([
            'team_id'        => 'required|string',
            'tournament_id'  => 'required|string',
            'amount'         => 'required|numeric',
            'payment_method' => 'nullable|string',
            'proof'          => 'required|image|mimes:jpg,jpeg,png|max:5120',
        ]);
 
        $path    = $request->file('proof')->store('payments/proofs', 'public');
        $proofUrl = Storage::url($path);
 
        $payment = Payment::create([
            'team_id'        => $request->team_id,
            'tournament_id'  => $request->tournament_id,
            'amount'         => $request->amount,
            'payment_method' => $request->payment_method ?? 'QRIS',
            'proof'          => $path,
            'proof_url'      => $proofUrl,
            'status'         => 'pending',
            'paid_at'        => now(),
        ]);
 
        return response()->json([
            'success' => true,
            'message' => 'Bukti pembayaran berhasil dikirim. Menunggu konfirmasi panitia.',
            'data'    => $payment,
        ], 201);
    }
 
    // PUT /api/payments/{id}
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment tidak ditemukan.'], 404);
        }
 
        $request->validate([
            'status' => 'required|in:pending,paid,rejected',
        ]);
 
        $payment->update(['status' => $request->status]);
 
        return response()->json([
            'success' => true,
            'message' => 'Status pembayaran diperbarui.',
            'data'    => $payment,
        ]);
    }
 
    // DELETE /api/payments/{id}
    public function destroy($id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['success' => false, 'message' => 'Payment tidak ditemukan.'], 404);
        }
 
        if ($payment->proof) {
            Storage::disk('public')->delete($payment->proof);
        }
 
        $payment->delete();
 
        return response()->json(['success' => true, 'message' => 'Payment berhasil dihapus.']);
    }
}
 