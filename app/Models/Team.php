<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use App\Models\Tournament; 
use App\Models\Payment; 

class Team extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'teams';

    protected $fillable = [
        'name',
        'logo',
        'captain_id',
        'tournament_id',
        'members',
        'status',
        'registered_at',
    ];

    // Relasi ke Payment (satu tim bisa punya banyak payment)
    public function payments()
    {
        return $this->hasMany(Payment::class, 'team_id');
    }

    // Relasi ke Tournament
    public function tournament()
    {
        return $this->belongsTo(Tournament::class, 'tournament_id');
    }
}