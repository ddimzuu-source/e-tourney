@extends('layouts.admin')

@section('title', 'Edit Team')

@section('content')

<div class="max-w-2xl">

    <h1 class="text-5xl font-bold mb-2">
        Edit Team
    </h1>

    <p class="text-slate-400 mb-8">
        Update data team
    </p>

    <div class="bg-slate-800 rounded-3xl p-8">

        <form action="/teams/{{ $team->id }}" method="POST">

            @csrf
            @method('PUT')

            <div class="mb-5">

                <label class="block mb-2 font-semibold">
                    Nama Team
                </label>

                <input type="text"
                    name="name"
                    value="{{ $team->name }}"
                    class="w-full bg-slate-700 rounded-2xl p-4 outline-none">

            </div>

            <div class="mb-8">

                <label class="block mb-2 font-semibold">
                    Tournament
                </label>

                <select name="tournament_id"
                    class="w-full bg-slate-700 rounded-2xl p-4 outline-none">

                    @foreach ($tournaments as $tournament)

                    <option
                        value="{{ $tournament->id }}"
                        {{ $team->tournament_id == $tournament->id ? 'selected' : '' }}>

                        {{ $tournament->name }}

                    </option>

                    @endforeach

                </select>

            </div>

            <button
                class="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-2xl font-bold">
                Update Team
            </button>

        </form>

    </div>

</div>

@endsection