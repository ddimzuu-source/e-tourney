<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Bracket extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'brackets';

    protected $fillable = [
        'tournament_id',
        'tournament_name',
        'rounds',
        'status',
        'generated_at',
    ];

    protected $casts = [
        'rounds' => 'array',
    ];
}
