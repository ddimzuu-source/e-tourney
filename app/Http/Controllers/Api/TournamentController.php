<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http; // Wajib import ini untuk nembak API Challonge

class TournamentController extends Controller
{
    public function index(): JsonResponse
    {
        $tournaments = Tournament::orderBy('created_at', 'desc')->get();
        return response()->json($tournaments);
    }

    public function store(Request $request): JsonResponse
    {
        // 1. Validasi inputan form admin lu tetep utuh
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

        // 2. Ambil credentials Challonge dari file .env lu
        $apiKey   = env('CHALLONGE_API_KEY');
        $username = 'drmwnmass'; // Username akun lu

        // Bikin URL unique untuk turnamen di backend Challonge agar tidak bentrok
        $urlChallonge = 'etourney_' . time();

        // 3. Tembak API Challonge untuk booking bracket di server mereka
        try {
            $response = Http::withBasicAuth($username, $apiKey)
                ->post('https://api.challonge.com/v1/tournaments.json', [
                    'tournament' => [
                        'name'            => $request->name,
                        'url'             => $urlChallonge,
                        'tournament_type' => 'single elimination', // Set ke gugur tunggal bawaan esport
                    ]
                ]);

            if ($response->successful()) {
                $challongeData = $response->json()['tournament'];
                // Selipkan id jembatan dari Challonge ke data MongoDB lu
                $validated['challonge_id']  = (string) $challongeData['id'];
                $validated['challonge_url'] = $challongeData['url'];
            } else {
                // Jika API Key .env lu salah/gagal konek, set default null dulu biar web lu ga crash
                $validated['challonge_id']  = null;
                $validated['challonge_url'] = null;
            }
        } catch (\Exception $e) {
            $validated['challonge_id']  = null;
            $validated['challonge_url'] = null;
        }

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
        
        // BONUS OPTIONAL: Hapus turnamen di Challonge juga biar server mereka ga numpuk sampah
        if (!empty($tournament->challonge_id)) {
            $apiKey   = env('CHALLONGE_API_KEY');
            $username = 'drmwnmass';
            Http::withBasicAuth($username, $apiKey)
                ->delete("https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}.json");
        }

        $tournament->delete();
        return response()->json(['message' => 'Tournament deleted']);
    }

    /**
     * ── FITUR BARU: AMBIL DATA BRACKET DARI CHALLONGE ──
     * Endpoint ini yang nanti bakal ditembak oleh React lu untuk gambar bagan match tim
     */
    public function getBracket(string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);

        if (empty($tournament->challonge_id)) {
            return response()->json(['message' => 'Turnamen ini belum terintegrasi dengan Challonge.'], 400);
        }

        $apiKey   = env('CHALLONGE_API_KEY');
        $username = 'drmwnmass';

        // Tarik data matches murni langsung dari Challonge
        $response = Http::withBasicAuth($username, $apiKey)
            ->get("https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}/matches.json");

        if ($response->failed()) {
            return response()->json(['message' => 'Gagal mengambil bagan dari server Challonge.'], 500);
        }

        return response()->json($response->json());
    }
}