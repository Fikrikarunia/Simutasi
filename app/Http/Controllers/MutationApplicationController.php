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
            'kk' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
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
}
