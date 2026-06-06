<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Register</title>

    <script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="bg-[#020617] min-h-screen flex items-center justify-center px-4 py-10">

    <div class="w-full max-w-md bg-slate-800 rounded-3xl p-10 shadow-2xl">

        <!-- LOGO -->
        <div class="text-center mb-8">

            <h1 class="text-5xl font-extrabold text-blue-400">
                E-Tourney
            </h1>

            <p class="text-slate-400 mt-3">
                Buat akun baru
            </p>

        </div>

        <form method="POST" action="{{ route('register') }}">

            @csrf

            <!-- NAME -->
            <div class="mb-5">

                <label class="block text-white mb-2">
                    Name
                </label>

                <input
                    type="text"
                    name="name"
                    value="{{ old('name') }}"
                    required
                    autofocus
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('name')"
                    class="mt-2" />

            </div>

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
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('email')"
                    class="mt-2" />

            </div>

            <!-- ROLE -->
            <div class="mb-5">

                <label class="block text-white mb-2">
                    Role
                </label>

                <select
                    name="role"
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                    <option value="peserta">
                        Peserta
                    </option>

                    <option value="panitia">
                        Panitia
                    </option>

                    <option value="admin">
                        Admin
                    </option>

                </select>

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

            <!-- CONFIRM PASSWORD -->
            <div class="mb-6">

                <label class="block text-white mb-2">
                    Confirm Password
                </label>

                <input
                    type="password"
                    name="password_confirmation"
                    required
                    class="w-full bg-slate-700 border-none rounded-2xl text-white p-4 focus:ring-2 focus:ring-blue-500">

                <x-input-error
                    :messages="$errors->get('password_confirmation')"
                    class="mt-2" />

            </div>

            <!-- LOGIN LINK -->
            <div class="flex justify-between items-center mb-6">

                <a
                    href="{{ route('login') }}"
                    class="text-sm text-blue-400 hover:text-blue-300">

                    Already registered?

                </a>

            </div>

            <!-- BUTTON -->
            <button
                type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-bold py-4 rounded-2xl">

                Register

            </button>

        </form>

    </div>

</body>

</html>