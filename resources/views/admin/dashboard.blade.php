@extends('layouts.admin')

@section('title', 'Dashboard Admin')

@section('content')

<div class="grid grid-cols-3 gap-6">

    <!-- CARD 1 -->
    <div class="bg-slate-800 p-8 rounded-3xl">

        <h2 class="text-2xl font-bold mb-5">
            Tournament
        </h2>

        <p class="text-6xl font-bold text-blue-400">
            0
        </p>

    </div>

    <!-- CARD 2 -->
    <div class="bg-slate-800 p-8 rounded-3xl">

        <h2 class="text-2xl font-bold mb-5">
            Teams
        </h2>

        <p class="text-6xl font-bold text-green-400">
            0
        </p>

    </div>


</div>

@endsection