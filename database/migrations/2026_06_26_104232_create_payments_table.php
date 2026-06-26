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
    Schema::create('payments', function (Blueprint $table) {
        $table->id();
        $table->string('team_id'); // Menghubungkan ke tim yang daftar
        $table->string('tournament_id'); // Menghubungkan ke turnamennya
        $table->integer('amount'); // Nominal yang harus dibayar
        $table->string('proof_path')->nullable(); // Tempat menyimpan URL/path foto dari Supabase
        $table->string('status')->default('PENDING'); // PENDING, APPROVED, REJECTED
        $table->timestamps();
    });
}
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
