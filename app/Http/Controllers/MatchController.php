<?php

namespace App\Http\Controllers;

use App\Models\MatchModel;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function saveScore(Request $request, $id)
    {
        $match = MatchModel::findOrFail($id);

        $match->score1 = $request->score1;
        $match->score2 = $request->score2;

        if ($request->score1 > $request->score2) {
            $match->winner = $match->team1;
        } else {
            $match->winner = $match->team2;
        }

        $match->save();

        return back();
    }
}