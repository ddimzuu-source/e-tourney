<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Confirm Password</title>

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
                Konfirmasi password akun kamu
            </p>

        </div>

        <!-- INFO -->
        <div class="mb-6 text-sm text-slate-300 leading-relaxed">

            This is a secure area of the application.  
            Silakan masukkan password sebelum melanjutkan.

        </div>

        <form method="POST" action="{{ route('password.confirm') }}">

            @csrf

            <!-- PASSWORD -->
            <div class="mb-6">

                <label class="block text-white mb-2">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    required
                    autocomplete="current-password"
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('password')"
                    class="mt-2" />

            </div>

            <!-- BUTTON -->
            <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-bold py-4 rounded-2xl">

                Confirm Password

            </button>

        </form>

    </div>

</body>

</html>