<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Payment extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'payments';

    protected $fillable = [
        'team_id',
        'tournament_id',
        'user_id',
        'amount',
        'status',
        'payment_method',
        'proof_image',
        'paid_at',
    ];
    public function team()
    {
        return $this->belongsTo(Team::class, 'team_id');
    }
}
