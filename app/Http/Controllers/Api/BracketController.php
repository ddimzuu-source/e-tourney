<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Tournament;
use App\Models\Team;
use App\Models\Bracket;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
 
class BracketController extends Controller
{
    // GET /api/tournaments/{id}/bracket
    public function show(string $id): JsonResponse
    {
        $bracket = Bracket::where('tournament_id', $id)->first();
 
        if (!$bracket) {
            return response()->json(['message' => 'Bracket belum dibuat.'], 404);
        }
 
        return response()->json($bracket);
    }
 
    // POST /api/tournaments/{id}/bracket/generate
    public function generate(string $id): JsonResponse
    {
        $tournament = Tournament::findOrFail($id);
 
        $teams = Team::where('tournament_id', $id)
            ->where('status', 'approved')
            ->get();
 
        if ($teams->count() < 2) {
            return response()->json(['message' => 'Minimal 2 tim approved untuk generate bracket.'], 400);
        }
 
        $teamList = $teams->shuffle()->values();
        $rounds   = $this->generateSingleElimination($teamList->toArray());
 
        $bracket = Bracket::updateOrCreate(
            ['tournament_id' => $id],
            [
                'tournament_id'   => $id,
                'tournament_name' => $tournament->name,
                'rounds'          => $rounds,
                'status'          => 'ongoing',
                'generated_at'    => now(),
            ]
        );
 
        $tournament->update(['status' => 'ongoing']);
 
        return response()->json($bracket, 201);
    }
 
    // PUT /api/brackets/{bracketId}/match/{roundIndex}/{matchIndex}
    public function updateMatch(Request $request, string $bracketId, int $roundIndex, int $matchIndex): JsonResponse
    {
        // Cari bracket by tournament_id ATAU _id (string comparison)
        $bracket = Bracket::where('tournament_id', $bracketId)->first()
                ?? Bracket::all()->firstWhere('_id', $bracketId);
 
        if (!$bracket) {
            return response()->json(['message' => 'Bracket tidak ditemukan.'], 404);
        }
 
        $request->validate([
            'winner_id'   => 'required|string',
            'winner_name' => 'required|string',
            'score_1'     => 'nullable|integer',
            'score_2'     => 'nullable|integer',
        ]);
 
        $rounds = $bracket->rounds;
 
        if (!isset($rounds[$roundIndex]['matches'][$matchIndex])) {
            return response()->json(['message' => 'Match tidak ditemukan.'], 404);
        }
 
        // Update hasil match
        $rounds[$roundIndex]['matches'][$matchIndex]['winner_id']   = $request->winner_id;
        $rounds[$roundIndex]['matches'][$matchIndex]['winner_name'] = $request->winner_name;
        $rounds[$roundIndex]['matches'][$matchIndex]['score_1']     = $request->score_1 ?? 0;
        $rounds[$roundIndex]['matches'][$matchIndex]['score_2']     = $request->score_2 ?? 0;
        $rounds[$roundIndex]['matches'][$matchIndex]['status']      = 'completed';
 
        // Propagate winner ke round berikutnya
        $nextRound = $roundIndex + 1;
        $nextMatch = (int) floor($matchIndex / 2);
        $isTeam1   = $matchIndex % 2 === 0;
 
        if (isset($rounds[$nextRound]['matches'][$nextMatch])) {
            if ($isTeam1) {
                $rounds[$nextRound]['matches'][$nextMatch]['team1_id']   = $request->winner_id;
                $rounds[$nextRound]['matches'][$nextMatch]['team1_name'] = $request->winner_name;
            } else {
                $rounds[$nextRound]['matches'][$nextMatch]['team2_id']   = $request->winner_id;
                $rounds[$nextRound]['matches'][$nextMatch]['team2_name'] = $request->winner_name;
            }
        }
 
        // Force update rounds ke MongoDB
        $bracket->rounds = $rounds;
        $bracket->save();
 
        return response()->json($bracket);
    }
 
    private function generateSingleElimination(array $teams): array
    {
        $rounds   = [];
        $roundNum = 1;
        $current  = $teams;
 
        while (count($current) % 2 !== 0) {
            $current[] = ['id' => null, 'name' => 'BYE', 'members' => []];
        }
 
        while (count($current) > 1) {
            $matches = [];
            for ($i = 0; $i < count($current); $i += 2) {
                $team1 = $current[$i];
                $team2 = $current[$i + 1];
 
                $match = [
                    'match_id'    => uniqid('match_'),
                    'team1_id'    => $team1['id'] ?? null,
                    'team1_name'  => $team1['name'] ?? 'BYE',
                    'team2_id'    => $team2['id'] ?? null,
                    'team2_name'  => $team2['name'] ?? 'BYE',
                    'winner_id'   => null,
                    'winner_name' => null,
                    'score_1'     => 0,
                    'score_2'     => 0,
                    'status'      => 'pending',
                ];
 
                if ($team1['name'] === 'BYE') {
                    $match['winner_id']   = $team2['id'];
                    $match['winner_name'] = $team2['name'];
                    $match['status']      = 'completed';
                } elseif ($team2['name'] === 'BYE') {
                    $match['winner_id']   = $team1['id'];
                    $match['winner_name'] = $team1['name'];
                    $match['status']      = 'completed';
                }
 
                $matches[] = $match;
            }
 
            $rounds[] = [
                'round'   => $roundNum,
                'label'   => $this->getRoundLabel($roundNum, count($current)),
                'matches' => $matches,
            ];
 
            $current = array_map(fn($m) => [
                'id'      => $m['winner_id'],
                'name'    => $m['winner_name'] ?? 'TBD',
                'members' => [],
            ], $matches);
 
            $roundNum++;
        }
 
        return $rounds;
    }
 
    private function getRoundLabel(int $round, int $teamsInRound): string
    {
        if ($teamsInRound === 2) return 'Final';
        if ($teamsInRound === 4) return 'Semi Final';
        if ($teamsInRound === 8) return 'Quarter Final';
        return "Round {$round}";
    }
}
 