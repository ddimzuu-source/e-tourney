<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('match_models', function (Blueprint $table) {

            $table->id();

            $table->foreignId('tournament_id');

            $table->string('team1');
            $table->string('team2');

            $table->integer('score1')->nullable();
            $table->integer('score2')->nullable();

            $table->string('winner')->nullable();

            $table->integer('round')->default(1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('match_models');
    }
};