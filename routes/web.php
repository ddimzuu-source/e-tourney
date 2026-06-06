<?php

use Illuminate\Support\Facades\Route;

// Semua halaman ditangani React (SPA)
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');