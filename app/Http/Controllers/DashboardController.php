<?php

namespace App\Http\Controllers;

use App\Models\MutationApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->isAdminDinas() || $user->isSuperAdmin()) {
            // Admin Dinas Metrics
            $stats = [
                'menunggu_verifikasi' => MutationApplication::where('status', 'Diajukan')->count(),
                'selesai_hari_ini' => MutationApplication::where('status', 'Selesai')->whereDate('completed_at', today())->count(),
                'dikembalikan' => MutationApplication::where('status', 'Dikembalikan')->count(),
                'surat_antri' => MutationApplication::where('status', 'Diverifikasi')->orWhere('status', 'Surat Diproses')->count(),
                'total_semua' => MutationApplication::count(),
            ];

            $applications = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'documents'])
                ->when($request->search, function ($query, $search) {
                    $query->whereHas('student', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%");
                    })->orWhere('school_origin_name', 'like', "%{$search}%")
                      ->orWhere('school_destination_name', 'like', "%{$search}%");
                })
                ->when($request->type && $request->type !== 'Semua Jenis', function ($query) use ($request) {
                    $query->where('type', $request->type);
                })
                ->when($request->status && $request->status !== 'Semua Status', function ($query) use ($request) {
                    $query->where('status', $request->status);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString();

            return Inertia::render('Admin/Dashboard', [
                'stats' => $stats,
                'applications' => $applications,
                'filters' => $request->only(['search', 'type', 'status']),
            ]);
        } else {
            // Operator Sekolah Metrics
            $schoolId = $user->school_id;

            $stats = [
                'total_pengajuan' => MutationApplication::where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId)->count(),
                'menunggu_verifikasi' => MutationApplication::where(function($q) use ($schoolId) {
                    $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
                })->where('status', 'Diajukan')->count(),
                'perlu_perbaikan' => MutationApplication::where(function($q) use ($schoolId) {
                    $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
                })->where('status', 'Dikembalikan')->count(),
                'selesai' => MutationApplication::where(function($q) use ($schoolId) {
                    $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
                })->where('status', 'Selesai')->count(),
            ];

            $applications = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'letter'])
                ->where(function($q) use ($schoolId) {
                    $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
                })
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return Inertia::render('Operator/Dashboard', [
                'stats' => $stats,
                'applications' => $applications,
                'school' => $user->school,
            ]);
        }
    }
}
