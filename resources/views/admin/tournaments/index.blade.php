@extends('layouts.admin')

@section('title', 'Tournament')

@section('content')

<div class="mb-6">

    <a href="/tournaments/create"
        class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl font-bold">
        + Create Tournament
    </a>

</div>

<div class="bg-slate-800 rounded-3xl overflow-hidden">

    <table class="w-full">

        <thead class="bg-slate-700">
            <tr>
                <th class="p-5 text-left">Name</th>
                <th class="p-5 text-left">Game</th>
                <th class="p-5 text-left">Max Teams</th>
                <th class="p-5 text-left">Start Date</th>
                <th class="p-5 text-left">Action</th>
            </tr>
        </thead>

        <tbody>

            @forelse ($tournaments as $tournament)

            <tr class="border-b border-slate-700">

                <td class="p-5">
                    {{ $tournament->name }}
                </td>

                <td class="p-5">
                    {{ $tournament->game }}
                </td>

                <td class="p-5">
                    {{ $tournament->max_teams }}
                </td>

                <td class="p-5">
                    {{ $tournament->start_date }}
                </td>

                <td class="p-5 space-y-3">

                    <a href="/peserta/tournaments/{{ $tournament->id }}/bracket"
                        class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl inline-block">
                        View Bracket
                    </a>

                    <form action="/tournaments/{{ $tournament->id }}/generate"
                        method="POST">

                        @csrf

                        <button
                            class="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl">
                            Generate Challonge
                        </button>

                    </form>

                    <form action="/tournaments/{{ $tournament->id }}"
                        method="POST">

                        @csrf
                        @method('DELETE')

                        <button
                            class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl">
                            Delete
                        </button>

                    </form>

                </td>

            </tr>

            @empty

            <tr>
                <td colspan="5" class="p-10 text-center">
                    Belum ada tournament
                </td>
            </tr>

            @endforelse

        </tbody>

    </table>

</div>

@endsection