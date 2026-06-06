<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Login</title>

    <script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="bg-[#020617] min-h-screen flex items-center justify-center px-4">

    <div class="w-full max-w-md bg-slate-800 rounded-3xl p-10 shadow-2xl">

        <!-- LOGO -->
        <div class="text-center mb-8">

            <h1 class="text-5xl font-extrabold text-blue-400">
                E-Tourney
            </h1>

            <p class="text-slate-400 mt-3">
                Login ke akun kamu
            </p>

        </div>

        <!-- STATUS -->
        <x-auth-session-status
            class="mb-4"
            :status="session('status')" />

        <form method="POST" action="{{ route('login') }}">

            @csrf

            <!-- EMAIL -->
            <div class="mb-5">

                <label class="block text-white mb-2">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value="{{ old('email') }}"
                    required
                    autofocus
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('email')"
                    class="mt-2" />

            </div>

            <!-- PASSWORD -->
            <div class="mb-5">

                <label class="block text-white mb-2">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    required
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('password')"
                    class="mt-2" />

            </div>

            <!-- REMEMBER -->
            <div class="flex items-center justify-between mb-6">

                <label
                    class="flex items-center text-sm text-slate-300">

                    <input
                        type="checkbox"
                        name="remember"
                        class="rounded border-slate-600 bg-slate-700 text-blue-500">

                    <span class="ml-2">
                        Remember me
                    </span>

                </label>

                @if (Route::has('password.request'))

                <a
                    class="text-sm text-blue-400 hover:text-blue-300"
                    href="{{ route('password.request') }}">

                    Forgot Password?

                </a>

                @endif

            </div>

            <!-- BUTTON -->
            <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-bold py-4 rounded-2xl">

                Login

            </button>

        </form>

    </div>

</body>

</html>