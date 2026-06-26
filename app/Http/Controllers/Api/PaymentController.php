<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Payment; 

class PaymentController extends Controller
{
    public function uploadProof(Request $request)
    {
        // 1. Validasi input file dari frontend (Wajib berupa gambar max 2MB)
        $request->validate([
            'payment_id' => 'required',
            'proof_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            // 2. Ambil file gambar dari request
            $file = $request->file('proof_image');
            
            // 3. Buat nama file unik agar tidak bentrok di Supabase
            $fileName = time() . '_' . $file->getClientOriginalName();

            // 4. Upload ke disk 'supabase' yang sudah di-setup di config/filesystems.php
            $path = Storage::disk('supabase')->putFileAs('proofs', $file, $fileName);

            // 5. FIX: Definisikan dulu disk-nya ke variabel agar bisa memanggil method url() tanpa error
            /** @var \Illuminate\Filesystem\FilesystemAdapter $supabaseDisk */
            $supabaseDisk = Storage::disk('supabase');
            $publicUrl = $supabaseDisk->url($path);

            // 6. UPDATE DATABASE: Menyimpan URL bukti transfer ke data pembayaran terkait di MongoDB
            /** @var \App\Models\Payment|\Illuminate\Database\Eloquent\Builder $paymentModel */
            $paymentModel = new Payment();
            $payment = $paymentModel->find($request->payment_id);
            
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Data pembayaran tidak ditemukan.'
                ], 404);
            }

            $payment->update([
                'proof_path' => $publicUrl, 
                'status' => 'PENDING'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bukti transfer berhasil diunggah ke Supabase dan database diperbarui!',
                'path' => $path,
                'url' => $publicUrl
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengunggah file: ' . $e->getMessage()
            ], 500);
        }
    }
}