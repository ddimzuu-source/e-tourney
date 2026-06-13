<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        $teams = Team::orderBy('created_at', 'desc')->get();
        return response()->json($teams);
    }
 
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => 'required|string',
            'tournament_id' => 'required|string',
            'captain_id'    => 'required|string',
            'members'       => 'nullable|array',
        ]);
 
        // ── Validasi jumlah anggota sesuai min_members turnamen ──────────────
        $tournament = Tournament::find($request->tournament_id);
 
        if ($tournament && isset($tournament->min_members)) {
            $memberCount = count($request->members ?? []);
            $minMembers  = (int) $tournament->min_members;
 
            if ($memberCount < $minMembers) {
                return response()->json([
                    'success' => false,
                    'message' => "Tim {$tournament->game} membutuhkan minimal {$minMembers} anggota. Kamu baru memasukkan {$memberCount} anggota.",
                    'min_members' => $minMembers,
                    'current_count' => $memberCount,
                ], 422);
            }
        }
 
        // ── Cek apakah slot turnamen masih tersedia ──────────────────────────
        if ($tournament) {
            $approvedCount = Team::where('tournament_id', $request->tournament_id)
                                 ->where('status', 'approved')
                                 ->count();
 
            if ($approvedCount >= (int) $tournament->max_teams) {
                return response()->json([
                    'success' => false,
                    'message' => 'Slot turnamen sudah penuh.',
                ], 422);
            }
        }
 
        $validated['status']        = 'pending';
        $validated['registered_at'] = now();
 
        $team = Team::create($validated);
 
        return response()->json($team, 201);
    }
 
    public function show(string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
        return response()->json($team);
    }
 
    public function update(Request $request, string $id): JsonResponse
    {
        $team      = Team::findOrFail($id);
        $oldStatus = $team->status;
        $newStatus = $request->input('status', $oldStatus);
 
        $team->update($request->all());
 
        // ── Update slots_used di Tournament ──────────────────────────────────
        if ($oldStatus !== $newStatus && $team->tournament_id) {
            $tournament = Tournament::find($team->tournament_id);
            if ($tournament) {
                $approvedCount = Team::where('tournament_id', $team->tournament_id)
                                     ->where('status', 'approved')
                                     ->count();
                $tournament->update(['slots_used' => $approvedCount]);
            }
        }
 
        return response()->json($team);
    }
 
    public function destroy(string $id): JsonResponse
    {
        $team = Team::findOrFail($id);
 
        if ($team->status === 'approved' && $team->tournament_id) {
            $tournament = Tournament::find($team->tournament_id);
            if ($tournament) {
                $approvedCount = Team::where('tournament_id', $team->tournament_id)
                                     ->where('status', 'approved')
                                     ->where('_id', '!=', $team->id)
                                     ->count();
                $tournament->update(['slots_used' => $approvedCount]);
            }
        }
 
        $team->delete();
        return response()->json(['message' => 'Team deleted']);
    }
}
 
































