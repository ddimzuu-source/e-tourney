<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Tourney</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="bg-slate-950 text-white">

    <div class="flex">

        <!-- SIDEBAR -->
        <aside class="w-64 h-screen bg-slate-900 fixed left-0 top-0 p-6">

            <h1 class="text-4xl font-bold text-blue-400 mb-10">
                E-Tourney
            </h1>

            <nav class="space-y-4">

                <a href="/dashboard"
                    class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                    Dashboard
                </a>

                <a href="/tournaments"
                    class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                    Tournament
                </a>

                <a href="/teams"
                    class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                    Teams
                </a>

                <a href="/payments"
                    class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                    Pendaftaran & Pembayaran
                </a>

            </nav>

        </aside>

        <!-- CONTENT -->
        <div class="ml-64 w-full p-10">

            <!-- TOPBAR -->
            <div class="flex justify-between items-center mb-10">

                <div>
                    <h1 class="text-5xl font-bold">
                        @yield('title')
                    </h1>

                    <p class="text-slate-400 mt-2">
                        Welcome back, {{ auth()->user()?->name }}
                    </p>
                </div>

                <form method="POST" action="{{ route('logout') }}">
                    @csrf

                    <button
                        class="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-bold">
                        Logout
                    </button>
                </form>

            </div>

            @yield('content')

        </div>

    </div>

</body>

</html>