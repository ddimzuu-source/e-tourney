@extends('layouts.peserta')

@section('title', 'Bracket')

@section('content')

<h1 class="text-5xl font-bold mb-3">
    Bracket
</h1>

<p class="text-slate-400 mb-10">
    View bracket tournament
</p>

<div class="bg-slate-800 p-10 rounded-3xl">

    <h2 class="text-3xl font-bold mb-6">
        {{ $tournament->name }}
    </h2>

    <a href="https://challonge.com/{{ $tournament->challonge_id }}"
        target="_blank"
        class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl font-bold inline-block">

        Open Challonge Bracket

    </a>

</div>

@endsection