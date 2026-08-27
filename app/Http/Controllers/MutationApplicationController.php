<?php

namespace App\Http\Controllers;

use App\Models\MutationApplication;
use App\Models\ApplicationDocument;
use App\Models\Student;
use App\Models\School;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MutationApplicationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'letter', 'operator']);

        if ($user->isOperatorSekolah()) {
            $schoolId = $user->school_id;
            $query->where(function($q) use ($schoolId) {
                $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
            });
        }

        if ($request->type && $request->type !== 'semua') {
            $query->where('type', ucfirst($request->type));
        }

        if ($request->status && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $search = $request->search;
            $query->whereHas('student', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('nisn', 'like', "%{$search}%");
            })->orWhere('registration_number', 'like', "%{$search}%");
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('Mutation/Index', [
            'applications' => $applications,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    public function create()
    {
        $schools = School::orderBy('name')->get();
        $user = Auth::user();

        return Inertia::render('Mutation/Create', [
            'schools' => $schools,
            'userSchool' => $user->school,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:Masuk,Keluar',
            'nisn' => 'required|string|size:10',
            'name' => 'required|string|max:255',
            'destination_class' => 'required|string',
            'school_origin_name' => 'required|string|max:255',
            'school_destination_name' => 'required|string|max:255',
            'reason' => 'nullable|string',
            'surat_pindah' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'rapor' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
            'kk' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ], [
            'required' => ':attribute wajib diisi / diunggah.',
            'size' => ':attribute harus berisi tepat :size digit.',
            'max' => ':attribute tidak boleh melebihi :max karakter / 2MB.',
            'mimes' => ':attribute harus berformat PDF, JPG, JPEG, atau PNG.',
            'in' => 'Pilihan :attribute tidak sesuai.',
        ], [
            'type' => 'Jenis Mutasi',
            'nisn' => 'NISN',
            'name' => 'Nama Lengkap Siswa',
            'destination_class' => 'Kelas Tujuan',
            'school_origin_name' => 'Sekolah Asal',
            'school_destination_name' => 'Sekolah Tujuan',
            'reason' => 'Alasan Mutasi',
            'surat_pindah' => 'Dokumen Surat Keterangan Pindah',
            'rapor' => 'Dokumen Fotokopi Rapor',
            'kk' => 'Dokumen Kartu Keluarga (KK)',
        ]);

        $user = Auth::user();

        // 1. Find or create Student
        $student = Student::firstOrCreate(
            ['nisn' => $request->nisn],
            [
                'name' => $request->name,
                'gender' => $request->gender ?? 'L',
                'current_class' => $request->destination_class,
                'birth_place' => $request->birth_place ?? 'Bandung Barat',
                'birth_date' => $request->birth_date ?? '2015-01-01',
            ]
        );

        // Update student name if different
        $student->update(['name' => $request->name]);

        // Generate registration number: REG-YYYY-XXX
        $count = MutationApplication::whereYear('created_at', date('Y'))->count() + 1;
        $regNumber = 'REG-' . date('Y') . '-' . str_pad($count, 3, '0', STR_PAD_LEFT);

        // Determine school origin & destination IDs
        $schoolOrigin = School::where('name', 'like', "%{$request->school_origin_name}%")->first();
        $schoolDest = School::where('name', 'like', "%{$request->school_destination_name}%")->first();

        $application = MutationApplication::create([
            'registration_number' => $regNumber,
            'type' => $request->type,
            'student_id' => $student->id,
            'school_origin_id' => $schoolOrigin ? $schoolOrigin->id : ($request->type === 'Keluar' ? $user->school_id : null),
            'school_origin_name' => $request->school_origin_name,
            'school_destination_id' => $schoolDest ? $schoolDest->id : ($request->type === 'Masuk' ? $user->school_id : null),
            'school_destination_name' => $request->school_destination_name,
            'destination_class' => $request->destination_class,
            'reason' => $request->reason,
            'status' => 'Diajukan',
            'operator_user_id' => $user->id,
            'submitted_at' => now(),
        ]);

        // Handle File Uploads
        $documents = [
            'surat_pindah' => 'Surat Pindah dari Sekolah Asal',
            'rapor' => 'Fotokopi Rapor (Legalisir)',
            'kk' => 'Kartu Keluarga (KK)',
        ];

        foreach ($documents as $key => $label) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                $path = $file->store("mutation_documents/{$application->id}", 'public');

                ApplicationDocument::create([
                    'mutation_application_id' => $application->id,
                    'document_type' => $key,
                    'document_label' => $label,
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getMimeType(),
                    'is_valid' => null,
                ]);
            }
        }

        // Audit Trail Log
        AuditTrail::create([
            'mutation_application_id' => $application->id,
            'user_id' => $user->id,
            'action' => 'Pengajuan Dibuat',
            'status_before' => null,
            'status_after' => 'Diajukan',
            'description' => "Pengajuan mutasi {$request->type} untuk {$student->name} ({$regNumber}) berhasil dibuat oleh {$user->name}.",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('dashboard')->with('success', "Pengajuan mutasi {$regNumber} berhasil dikirim.");
    }

    public function show($id)
    {
        $application = MutationApplication::with([
            'student',
            'schoolOrigin',
            'schoolDestination',
            'operator',
            'verifier',
            'documents',
            'letter',
            'auditTrails.user'
        ])->findOrFail($id);

        return Inertia::render('Mutation/Show', [
            'application' => $application,
            'userRole' => Auth::user()->role,
        ]);
    }

    public function verify(Request $request, $id)
    {
        $application = MutationApplication::with('student', 'documents')->findOrFail($id);
        $user = Auth::user();

        if (!$user->isAdminDinas() && !$user->isSuperAdmin()) {
            abort(403, 'Akses ditolak.');
        }

        $request->validate([
            'action' => 'required|in:revisi,setujui',
            'rejection_note' => 'nullable|string',
            'documents' => 'array',
        ]);

        $statusBefore = $application->status;

        // Update document validations
        if ($request->has('documents')) {
            foreach ($request->documents as $docId => $val) {
                ApplicationDocument::where('id', $docId)->update([
                    'is_valid' => isset($val['is_valid']) ? (bool)$val['is_valid'] : true,
                    'notes' => $val['notes'] ?? null,
                ]);
            }
        }

        if ($request->action === 'revisi') {
            $application->update([
                'status' => 'Dikembalikan',
                'rejection_note' => $request->rejection_note,
                'verifier_user_id' => $user->id,
            ]);

            AuditTrail::create([
                'mutation_application_id' => $application->id,
                'user_id' => $user->id,
                'action' => 'Pengajuan Dikembalikan',
                'status_before' => $statusBefore,
                'status_after' => 'Dikembalikan',
                'description' => "Pengajuan dikembalikan dengan catatan revisi: " . ($request->rejection_note ?: 'Dokumen belum sesuai.'),
                'ip_address' => $request->ip(),
            ]);

            return redirect()->route('dashboard')->with('success', 'Pengajuan mutasi telah dikembalikan ke Operator Sekolah dengan catatan revisi.');
        } else {
            $application->update([
                'status' => 'Diverifikasi',
                'verifier_user_id' => $user->id,
                'verified_at' => now(),
            ]);

            AuditTrail::create([
                'mutation_application_id' => $application->id,
                'user_id' => $user->id,
                'action' => 'Verifikasi Lengkap',
                'status_before' => $statusBefore,
                'status_after' => 'Diverifikasi',
                'description' => "Seluruh dokumen telah diverifikasi dan disetujui oleh {$user->name}.",
                'ip_address' => $request->ip(),
            ]);

            return redirect()->route('mutation.show', $application->id)->with('success', 'Dokumen diverifikasi lengkap. Siap diterbitkan Surat Mutasi Digital.');
        }
    }

    public function update(Request $request, $id)
    {
        $application = MutationApplication::with('documents')->findOrFail($id);
        $user = Auth::user();

        if ($application->operator_user_id !== $user->id && !$user->isAdminDinas()) {
            abort(403, 'Akses ditolak.');
        }

        // Resubmit updated files
        $documents = ['surat_pindah', 'rapor', 'kk'];
        foreach ($documents as $key) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                $path = $file->store("mutation_documents/{$application->id}", 'public');

                $existingDoc = ApplicationDocument::where('mutation_application_id', $application->id)
                    ->where('document_type', $key)
                    ->first();

                if ($existingDoc) {
                    $existingDoc->update([
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'file_type' => $file->getMimeType(),
                        'is_valid' => null,
                        'notes' => null,
                    ]);
                } else {
                    ApplicationDocument::create([
                        'mutation_application_id' => $application->id,
                        'document_type' => $key,
                        'document_label' => ucfirst(str_replace('_', ' ', $key)),
                        'file_path' => $path,
                        'original_name' => $file->getClientOriginalName(),
                        'file_size' => $file->getSize(),
                        'file_type' => $file->getMimeType(),
                        'is_valid' => null,
                    ]);
                }
            }
        }

        $statusBefore = $application->status;
        $application->update([
            'status' => 'Diajukan',
            'rejection_note' => null,
        ]);

        AuditTrail::create([
            'mutation_application_id' => $application->id,
            'user_id' => $user->id,
            'action' => 'Perbaikan Dokumen',
            'status_before' => $statusBefore,
            'status_after' => 'Diajukan',
            'description' => "Operator sekolah memperbarui dokumen persyaratan dan mengajukan kembali.",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Dokumen berhasil diperbarui dan dikirim ulang untuk verifikasi.');
    }

    public function downloadDocument($id)
    {
        $document = ApplicationDocument::findOrFail($id);

        if (!Storage::disk('public')->exists($document->file_path)) {
            return response()->streamDownload(function() use ($document) {
                echo "=========================================\n";
                echo "SIMUTASI - DOKUMEN SAMPEL DEMO\n";
                echo "=========================================\n\n";
                echo "Jenis Dokumen : " . $document->document_label . "\n";
                echo "Nama File     : " . $document->original_name . "\n";
                echo "Keterangan    : Dokumen sampel bawaan sistem demo.\n";
            }, $document->original_name, [
                'Content-Type' => 'text/plain',
            ]);
        }

        return Storage::disk('public')->download($document->file_path, $document->original_name);
    }

    public function viewDocument($id)
    {
        $document = ApplicationDocument::findOrFail($id);

        if (!Storage::disk('public')->exists($document->file_path)) {
            $label = e($document->document_label);
            $name = e($document->original_name);
            $html = <<<HTML
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pratinjau Dokumen</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; margin: 0; padding: 24px; display: flex; align-items: center; justify-content: center; min-height: 85vh; color: #1e293b; }
        .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; text-align: center; max-width: 420px; width: 100%; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .icon { width: 56px; height: 56px; background: #e0f2fe; color: #0369a1; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin: 0 auto 16px auto; }
        h3 { margin: 0 0 6px 0; font-size: 16px; font-weight: 800; color: #0f172a; }
        p { margin: 0 0 16px 0; font-size: 12px; color: #64748b; }
        .badge { display: inline-block; padding: 10px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 12px; font-weight: 600; color: #475569; }
    </style>
</head>
<body>
    <div class="card">
        <div class="icon">📄</div>
        <h3>{$label}</h3>
        <p>{$name}</p>
        <div class="badge">Dokumen Sampel Sistem Demo</div>
    </div>
</body>
</html>
HTML;
            return response($html, 200, ['Content-Type' => 'text/html']);
        }

        $path = Storage::disk('public')->path($document->file_path);
        $mimeType = Storage::disk('public')->mimeType($document->file_path) ?: ($document->file_type ?: 'application/pdf');

        return response()->file($path, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . $document->original_name . '"',
        ]);
    }
}
