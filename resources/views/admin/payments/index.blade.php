@extends('layouts.admin')

@section('title', 'Pendaftaran')

@section('content')

<div class="flex justify-between items-center mb-6">

    <div>

        <h1 class="text-5xl font-bold mb-2">
            Pendaftaran & Pembayaran
        </h1>

        <p class="text-slate-400">
            Pengelolaan pendaftaran dan pembayaran untuk turnamen Anda
        </p>

    </div>

</div>

<div class="bg-slate-800 rounded-3xl overflow-hidden">

    <table class="w-full">

        <thead class="bg-slate-700 text-slate-200">

            <tr>

                <th class="p-5 text-left">
                    Team
                </th>

                <th class="p-5 text-left">
                    Method
                </th>

                <th class="p-5 text-left">
                    Proof
                </th>

                <th class="p-5 text-left">
                    Status
                </th>

                <th class="p-5 text-left">
                    Action
                </th>

            </tr>

        </thead>

        <tbody>

            @forelse ($payments as $payment)

            <tr class="border-b border-slate-700 hover:bg-slate-700/30 duration-200">

                {{-- TEAM --}}
                <td class="p-5 font-semibold">

                    {{ $payment->team->name }}

                </td>

                {{-- PAYMENT METHOD --}}
                <td class="p-5 text-slate-300">

                    {{ $payment->payment_method }}

                </td>

                {{-- PROOF --}}
                <td class="p-5">

                    <a href="{{ asset('storage/' . $payment->proof) }}"
                        target="_blank">

                        <img
                            src="{{ asset('storage/' . $payment->proof) }}"
                            class="w-28 h-20 object-cover rounded-xl border border-slate-600 hover:scale-105 duration-300">

                    </a>

                </td>

                {{-- STATUS --}}
                <td class="p-5">

                    @if($payment->status == 'approved')

                    <span class="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl font-bold">
                        Approved
                    </span>

                    @elseif($payment->status == 'rejected')

                    <span class="bg-red-500/20 text-red-400 px-4 py-2 rounded-xl font-bold">
                        Rejected
                    </span>

                    @else

                    <span class="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-xl font-bold">
                        Pending
                    </span>

                    @endif

                </td>

                {{-- ACTION --}}
                <td class="p-5">

                    <div class="flex gap-3">

                        @if($payment->status == 'pending')

                        <form action="/payments/{{ $payment->id }}/approve"
                            method="POST">

                            @csrf

                            <button
                                class="bg-green-500 hover:bg-green-600 duration-300 px-4 py-2 rounded-xl font-semibold">

                                Approve

                            </button>

                        </form>

                        <form action="/payments/{{ $payment->id }}/reject"
                            method="POST">

                            @csrf

                            <button
                                class="bg-red-500 hover:bg-red-600 duration-300 px-4 py-2 rounded-xl font-semibold">

                                Reject

                            </button>

                        </form>

                        @else

                        <span class="text-slate-400">
                            No Action
                        </span>

                        @endif

                    </div>

                </td>

            </tr>

            @empty

            <tr>

                <td colspan="5"
                    class="p-10 text-center text-slate-400">

                    Belum ada payment

                </td>

            </tr>

            @endforelse

        </tbody>

    </table>

</div>

@endsection