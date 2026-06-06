@extends('layouts.admin')

@section('title', 'Create Tournament')

@section('content')

<div class="bg-slate-800 p-10 rounded-3xl max-w-3xl">

    <form action="/tournaments" method="POST">

        @csrf

        <div class="mb-6">

            <label class="block mb-2">
                Tournament Name
            </label>

            <input type="text"
                name="name"
                class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">

        </div>

        <div class="mb-6">

            <label class="block mb-2">
                Description
            </label>

            <textarea
                name="description"
                rows="5"
                class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4"></textarea>

        </div>

        <div class="mb-6">

            <label class="block mb-2">
                Game
            </label>

            <input type="text"
                name="game"
                class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">

        </div>

        <div class="mb-6">

            <label class="block mb-2">
                Max Teams
            </label>

            <input type="number"
                name="max_teams"
                class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">

        </div>

        <div class="mb-8">

            <label class="block mb-2">
                Start Date
            </label>

            <input type="date"
                name="start_date"
                class="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">

        </div>

        <button
            class="bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-2xl font-bold">
            Create Tournament
        </button>

    </form>

</div>

@endsection