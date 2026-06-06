<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * GET /api/users
     * List all users with search & pagination
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        $perPage = $request->get('per_page', 10);
        $users = $query->select(['_id', 'name', 'email', 'role', 'avatar', 'phone'])
                       ->orderBy('created_at', 'desc')
                       ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data'    => $users,
        ]);
    }

    /**
     * GET /api/users/{id}
     * Show single user
     */
    public function show($id)
    {
        $user = User::select(['_id', 'name', 'email', 'role', 'avatar', 'phone'])
                    ->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $user,
        ]);
    }

    /**
     * POST /api/users
     * Create new user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role'     => ['required', Rule::in(['admin', 'user'])],
            'phone'    => 'nullable|string|max:20',
            'avatar'   => 'nullable|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat.',
            'data'    => $user->only(['_id', 'name', 'email', 'role', 'avatar', 'phone']),
        ], 201);
    }

    /**
     * PUT /api/users/{id}
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role'     => ['sometimes', Rule::in(['admin', 'user'])],
            'phone'    => 'nullable|string|max:20',
            'avatar'   => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui.',
            'data'    => $user->only(['_id', 'name', 'email', 'role', 'avatar', 'phone']),
        ]);
    }

    /**
     * DELETE /api/users/{id}
     * Delete user
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan.',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus.',
        ]);
    }
}
