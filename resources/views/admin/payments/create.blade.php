@extends('layouts.admin')

@section('title', 'Upload Payment')

@section('content')

<div class="max-w-2xl">

    <div class="bg-slate-800 p-8 rounded-3xl">

        <form action="/payments"
            method="POST"
            enctype="multipart/form-data">

            @csrf

            {{-- NAMA TEAM --}}
            <div class="mb-5">

                <label class="block mb-2">
                    Nama Team
                </label>

                <input
                    type="text"
                    name="team_name"
                    placeholder="Masukkan nama team"
                    class="w-full bg-slate-700 p-4 rounded-2xl">

            </div>

            {{-- PILIH TOURNAMENT --}}
            <div class="mb-5">

                <label class="block mb-2">
                    Tournament
                </label>

                <select
                    name="tournament_id"
                    class="w-full bg-slate-700 p-4 rounded-2xl">

                    @foreach ($tournaments as $tournament)

                    <option value="{{ $tournament->id }}">
                        {{ $tournament->name }}
                    </option>

                    @endforeach

                </select>

            </div>

            {{-- PAYMENT METHOD --}}
            <div class="mb-5">

                <label class="block mb-2">
                    Payment Method
                </label>

                <input
                    type="text"
                    name="payment_method"
                    placeholder="Contoh: Dana / OVO / Bank"
                    class="w-full bg-slate-700 p-4 rounded-2xl">

            </div>

            {{-- UPLOAD BUKTI --}}
            <div class="mb-8">

                <label class="block mb-2">
                    Upload Proof
                </label>

                <input
                    type="file"
                    name="proof"
                    class="w-full bg-slate-700 p-4 rounded-2xl">

            </div>

            <button
                class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl font-bold">

                Daftar Turnamen

            </button>

        </form>

    </div>

</div>

@endsection