<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Verify Email</title>

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
                Verifikasi email akun kamu
            </p>

        </div>

        <!-- INFO -->
        <div class="mb-6 text-sm text-slate-300 leading-relaxed">

            Thanks for signing up!  
            Sebelum mulai, verifikasi email kamu terlebih dahulu melalui link yang sudah dikirim.

        </div>

        <!-- SUCCESS -->
        @if (session('status') == 'verification-link-sent')

        <div class="mb-6 bg-green-500/20 text-green-400 p-4 rounded-2xl text-sm font-semibold">

            Link verifikasi baru berhasil dikirim ke email kamu.

        </div>

        @endif

        <div class="flex flex-col gap-4">

            <!-- RESEND -->
            <form method="POST"
                action="{{ route('verification.send') }}">

                @csrf

                <button
                    type="submit"
                    class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-bold py-4 rounded-2xl">

                    Resend Verification Email

                </button>

            </form>

            <!-- LOGOUT -->
            <form method="POST"
                action="{{ route('logout') }}">

                @csrf

                <button
                    type="submit"
                    class="w-full bg-red-500 hover:bg-red-600 transition-all duration-300 text-white font-bold py-4 rounded-2xl">

                    Logout

                </button>

            </form>

        </div>

    </div>

</body>

</html>