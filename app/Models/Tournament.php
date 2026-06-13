<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Tournament extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'tournaments';

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'max_teams',
        'slots_used',
        'game',
        'game_tag',
        'registration_fee',
        'prize',
        'status',
        'challonge_id',
        'min_members',
    ];
}