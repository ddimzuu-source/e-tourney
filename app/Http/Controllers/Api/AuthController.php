<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
 
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
 
    public function logout(): JsonResponse
    {
        auth('api')->logout();
        return response()->json(['message' => 'Logout berhasil.']);
    }
 
    public function me(Request $request): JsonResponse
    {
        return response()->json(auth('api')->user());
    }
 
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
 
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'peserta',
        ]);
 
        return response()->json([
            'message' => 'Registrasi berhasil, silakan login.',
            'user'    => $user
        ], 201);
    }
}
 