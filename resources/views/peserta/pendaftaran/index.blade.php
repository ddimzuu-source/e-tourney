@extends('layouts.peserta')

@section('title', 'Pendaftaran Saya')

@section('content')

<h1 class="text-5xl font-bold mb-3">
    Pendaftaran Saya
</h1>

<p class="text-slate-400 mb-10">
    Status pendaftaran team
</p>

<div class="bg-slate-800 rounded-3xl overflow-hidden">

    <table class="w-full">

        <thead class="bg-slate-700">

            <tr>
                <th class="p-5 text-left">Team</th>
                <th class="p-5 text-left">Tournament</th>
                <th class="p-5 text-left">Payment</th>
                <th class="p-5 text-left">Status</th>
            </tr>

        </thead>

        <tbody>

            @forelse ($payments as $payment)

            <tr class="border-b border-slate-700">

                <td class="p-5 font-bold">
                    {{ $payment->team->name }}
                </td>

                <td class="p-5">
                    {{ $payment->team->tournament->name }}
                </td>

                <td class="p-5">
                    {{ $payment->payment_method }}
                </td>

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

            </tr>

            @empty

            <tr>

                <td colspan="4"
                    class="p-10 text-center text-slate-400">

                    Belum ada pendaftaran

                </td>

            </tr>

            @endforelse

        </tbody>

    </table>

</div>

@endsection