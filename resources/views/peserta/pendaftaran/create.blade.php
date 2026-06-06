@extends('layouts.peserta')

@section('title', 'Daftar Tournament')

@section('content')

<h1 class="text-5xl font-bold mb-10">
    Daftar Tournament
</h1>

<div class="bg-slate-800 p-8 rounded-3xl max-w-2xl">

    <form action="/peserta/pendaftaran"
        method="POST"
        enctype="multipart/form-data">

        @csrf

        <input type="hidden"
            name="tournament_id"
            value="{{ $tournament->id }}">

        <div class="mb-5">

            <label class="block mb-2">
                Tournament
            </label>

            <input type="text"
                value="{{ $tournament->name }}"
                disabled
                class="w-full bg-slate-700 p-4 rounded-2xl">

        </div>

        <div class="mb-5">

            <label class="block mb-2">
                Nama Team
            </label>

            <input type="text"
                name="team_name"
                class="w-full bg-slate-700 p-4 rounded-2xl">

        </div>

        <div class="mb-5">

            <label class="block mb-2">
                Payment Method
            </label>

            <input type="text"
                name="payment_method"
                class="w-full bg-slate-700 p-4 rounded-2xl">

        </div>

        <div class="mb-8">

            <label class="block mb-2">
                Upload Bukti Pembayaran
            </label>

            <input type="file"
                name="proof"
                class="w-full bg-slate-700 p-4 rounded-2xl">

        </div>

        <button
            class="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold">

            Daftar Sekarang

        </button>

    </form>

</div>

@endsection