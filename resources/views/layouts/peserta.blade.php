<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>@yield('title')</title>

    @vite('resources/css/app.css')

</head>

<body class="bg-[#020817] text-white">

    <div class="flex min-h-screen">

        {{-- SIDEBAR --}}
        <aside class="w-64 bg-[#0B1220] p-6 flex flex-col justify-between">

            <div>

                <h1 class="text-4xl font-bold text-blue-400 mb-10">
                    E-Tourney
                </h1>

                <nav class="space-y-4">

                    <a href="/dashboard"
                        class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">

                        Dashboard

                    </a>

                    <a href="/peserta/tournaments"
                        class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                        Tournament
                    </a>

                    <a href="/peserta/pendaftaran"
                        class="block bg-slate-800 hover:bg-blue-500 duration-300 px-5 py-4 rounded-2xl">
                        Pendaftaran Saya
                    </a>

                </nav>

            </div>

            <form action="/logout"
                method="POST">

                @csrf

                <button
                    class="w-full bg-red-500 hover:bg-red-600 duration-300 py-4 rounded-2xl font-bold">

                    Logout

                </button>

            </form>

        </aside>

        {{-- CONTENT --}}
        <main class="flex-1 p-10">

            @yield('content')

        </main>

    </div>

</body>

</html>