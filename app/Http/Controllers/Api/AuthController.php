<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        return response()->json([
            'user'  => auth('api')->user(),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logout berhasil']);
    }

   public function me(Request $request): JsonResponse
{
    return response()->json(auth('api')->user());
}
}