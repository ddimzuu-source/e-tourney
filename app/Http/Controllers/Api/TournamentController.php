<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
 
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
            'min_members'      => 'required|integer|min:1', // ← BARU: minimal anggota per tim
            'registration_fee' => 'required|numeric',
            'prize'            => 'required|string',
            'start_date'       => 'required|string',
            'status'           => 'required|in:open,registration,ongoing,finished',
        ]);
 
        // Challonge integration (tetap dipertahankan)
       $apiKey   = env('CHALLONGE_API_KEY');
              $username = env('CHALLONGE_USERNAME', 'drmwnmass');
              $urlChallonge = 'etourney_' . time();

         try {
             if (empty($apiKey)) throw new \Exception('No API key');
    
    $response = Http::withBasicAuth($username, $apiKey)
                ->post('https://api.challonge.com/v1/tournaments.json', [
                    'tournament' => [
                        'name'            => $request->name,
                        'url'             => $urlChallonge,
                        'tournament_type' => 'single elimination',
                    ]
                ]);
 
            if ($response->successful()) {
                $challongeData = $response->json()['tournament'];
                $validated['challonge_id']  = (string) $challongeData['id'];
                $validated['challonge_url'] = $challongeData['url'];
            } else {
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
 
        if (!empty($tournament->challonge_id)) {
            $apiKey   = env('CHALLONGE_API_KEY');
            $username = 'drmwnmass';
            Http::withBasicAuth($username, $apiKey)
                ->delete("https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}.json");
        }
 
        $tournament->delete();
        return response()->json(['message' => 'Tournament deleted']);
    }
 
    public function getBracket(string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
 
        if (empty($tournament->challonge_id)) {
            return response()->json(['message' => 'Turnamen ini belum terintegrasi dengan Challonge.'], 400);
        }
 
        $apiKey   = env('CHALLONGE_API_KEY');
        $username = 'drmwnmass';
 
        $response = Http::withBasicAuth($username, $apiKey)
            ->get("https://api.challonge.com/v1/tournaments/{$tournament->challonge_id}/matches.json");
 
        if ($response->failed()) {
            return response()->json(['message' => 'Gagal mengambil bagan dari server Challonge.'], 500);
        }
 
        return response()->json($response->json());
    }
}
 