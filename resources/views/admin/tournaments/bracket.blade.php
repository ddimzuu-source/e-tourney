@extends('layouts.admin')

@section('title', 'Bracket')

@section('content')

<div class="bg-slate-800 p-10 rounded-3xl">

    <h1 class="text-3xl font-bold mb-6">
        Bracket Tournament
    </h1>

    <a href="https://challonge.com/{{ $tournament->challonge_id }}"
       target="_blank"
       class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl font-bold">

        Open Challonge Bracket

    </a>

</div>

@endsection