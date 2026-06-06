@extends('layouts.peserta')

@section('title', 'Tournament')

@section('content')

<h1 class="text-5xl font-bold mb-3">
    Tournament
</h1>

<p class="text-slate-400 mb-10">
    Lihat semua tournament
</p>

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

                <td class="p-5 flex gap-3">

                    <a href="/peserta/pendaftaran/create?tournament={{ $tournament->id }}"
                        class="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-bold">

                        Daftar

                    </a>

                    <a href="/peserta/tournaments/{{ $tournament->id }}/bracket"
                        class="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-bold">

                        View Bracket

                    </a>

                </td>

            </tr>

            @empty

            <tr>

                <td colspan="5"
                    class="p-10 text-center text-slate-400">

                    Belum ada tournament

                </td>

            </tr>

            @endforelse

        </tbody>

    </table>

</div>

@endsection