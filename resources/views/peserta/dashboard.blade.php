@extends('layouts.peserta')

@section('title', 'Dashboard Peserta')

@section('content')

<h1 class="text-5xl font-bold mb-3">
    Dashboard Peserta
</h1>

<p class="text-slate-400 mb-10">
    Selamat datang, {{ auth()->user()->name }}
</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div class="bg-slate-800 p-8 rounded-3xl">

        <h2 class="text-2xl font-bold mb-3">
            Tournament
        </h2>

        <p class="text-slate-400 mb-6">
            Lihat tournament yang tersedia
        </p>

        <a href="/peserta/tournaments"
            class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-2xl font-bold inline-block">

            Lihat Tournament

        </a>

    </div>

    <div class="bg-slate-800 p-8 rounded-3xl">

        <h2 class="text-2xl font-bold mb-3">
            Pendaftaran Saya
        </h2>

        <p class="text-slate-400 mb-6">
            Lihat status pendaftaran team
        </p>

        <a href="/peserta/pendaftaran"
            class="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold inline-block">

            Lihat Pendaftaran

        </a>

    </div>

</div>

@endsection