<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class MatchModel extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'matches';

    protected $fillable = [
        'tournament_id',
        'team1_id',
        'team2_id',
        'winner_id',
        'score_team1',
        'score_team2',
        'round',
        'status',
        'played_at',
    ];
}