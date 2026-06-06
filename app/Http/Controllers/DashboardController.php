<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $role = Auth::user()->role;

        if ($role == 'admin') {
            return view('admin.dashboard');
        }

        if ($role == 'panitia') {
            return view('panitia.dashboard');
        }

        return view('peserta.dashboard');
    }
}