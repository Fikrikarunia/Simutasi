<?php

namespace App\Http\Controllers;

use App\Models\MutationApplication;
use App\Models\MutationLetter;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class MutationLetterController extends Controller
{
    public function issue(Request $request, $applicationId)
    {
        $user = Auth::user();
        if (!$user->isAdminDinas() && !$user->isSuperAdmin()) {
            abort(403, 'Akses ditolak.');
        }

        $application = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination'])->findOrFail($applicationId);

        if ($application->status !== 'Diverifikasi' && $application->status !== 'Surat Diproses' && $application->status !== 'Selesai') {
            return back()->with('error', 'Status pengajuan belum diverifikasi lengkap.');
        }

        // Generate auto letter number: 400.3.5.1/{seq}-Bid. SD/2026
        $count = MutationLetter::count() + 80;
        $letterNumber = "400.3.5.1/{$count}-Bid. SD/" . date('Y');
        $qrHash = Str::random(32);

        $letter = MutationLetter::updateOrCreate(
            ['mutation_application_id' => $application->id],
            [
                'letter_number' => $letterNumber,
                'qr_code_hash' => $qrHash,
                'signed_by_name' => $request->signed_by_name ?? 'Popi Siti Ichsanniaty, S.Pd., M.Pd',
                'signed_by_nip' => $request->signed_by_nip ?? '197711142009012001',
                'signed_by_position' => $request->signed_by_position ?? 'Kepala Bidang Pembinaan SD / Ub. Analis Sub Koordinasi Kesiswaan SD',
                'issued_at' => now(),
            ]
        );

        $statusBefore = $application->status;
        $application->update([
            'status' => 'Selesai',
            'completed_at' => now(),
        ]);

        AuditTrail::create([
            'mutation_application_id' => $application->id,
            'user_id' => $user->id,
            'action' => 'Penerbitan Surat Digital',
            'status_before' => $statusBefore,
            'status_after' => 'Selesai',
            'description' => "Surat Rekomendasi Mutasi Digital (Nomor: {$letterNumber}) diterbitkan oleh {$user->name}.",
            'ip_address' => $request->ip(),
        ]);

        return redirect()->route('mutation.show', $application->id)->with('success', "Surat Rekomendasi Mutasi Digital ({$letterNumber}) telah diterbitkan!");
    }

    public function download($id)
    {
        $application = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'letter'])->findOrFail($id);

        if (!$application->letter) {
            return back()->with('error', 'Surat mutasi belum diterbitkan.');
        }

        // Generate QR code SVG or Base64 string for embedding in PDF
        $verifyUrl = route('letter.verify', $application->letter->qr_code_hash);
        $qrCodeSvg = base64_encode(QrCode::format('svg')->size(120)->errorCorrection('H')->generate($verifyUrl));

        $pdf = Pdf::loadView('pdf.mutation_letter', [
            'app' => $application,
            'letter' => $application->letter,
            'student' => $application->student,
            'verifyUrl' => $verifyUrl,
            'qrCodeSvg' => $qrCodeSvg,
        ]);

        $fileName = "Surat_Mutasi_" . Str::slug($application->student->name) . ".pdf";
        return $pdf->download($fileName);
    }

    public function preview($id)
    {
        $application = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'letter'])->findOrFail($id);
        $user = Auth::user();

        $letter = $application->letter;
        $isDraft = false;

        if (!$letter) {
            // Jika surat belum diterbitkan, izinkan Admin Dinas/Operator untuk meninjau Draf Surat
            $isDraft = true;
            $letter = (object)[
                'letter_number' => '400.3.5.1/DRAF-Bid. SD/' . date('Y'),
                'signed_by_name' => 'Popi Siti Ichsanniaty, S.Pd., M.Pd',
                'signed_by_nip' => '197711142009012001',
                'signed_by_position' => 'Kepala Bidang Pembinaan SD / Ub. Analis Sub Koordinasi Kesiswaan SD',
                'issued_at' => now(),
                'qr_code_hash' => 'draft-preview',
            ];

            $verifyUrl = url('/');
            $qrCodeSvg = base64_encode(QrCode::format('svg')->size(120)->errorCorrection('H')->generate('DRAF TINJAUAN SIMUTASI KBB - BELUM DITERBITKAN RESMI'));
            $fileName = "Draf_Surat_Mutasi_" . Str::slug($application->student ? $application->student->name : 'Siswa') . ".pdf";
        } else {
            // Generate QR code SVG or Base64 string for embedding in PDF
            $verifyUrl = route('letter.verify', $letter->qr_code_hash);
            $qrCodeSvg = base64_encode(QrCode::format('svg')->size(120)->errorCorrection('H')->generate($verifyUrl));
            $fileName = "Surat_Mutasi_" . Str::slug($application->student ? $application->student->name : 'Siswa') . ".pdf";
        }

        $pdf = Pdf::loadView('pdf.mutation_letter', [
            'app' => $application,
            'letter' => $letter,
            'student' => $application->student,
            'verifyUrl' => $verifyUrl,
            'qrCodeSvg' => $qrCodeSvg,
            'isDraft' => $isDraft,
        ]);

        return $pdf->stream($fileName);
    }

    public function verifyPublic($hash)
    {
        $letter = MutationLetter::with(['mutationApplication.student', 'mutationApplication.schoolOrigin', 'mutationApplication.schoolDestination'])
            ->where('qr_code_hash', $hash)
            ->firstOrFail();

        return Inertia::render('Public/VerifyLetter', [
            'letter' => $letter,
            'application' => $letter->mutationApplication,
            'student' => $letter->mutationApplication->student,
        ]);
    }
}
