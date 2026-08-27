<?php

namespace App\Http\Controllers;

use App\Models\MutationApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Home');
    }

    public function checkStatus(Request $request)
    {
        $request->validate([
            'query' => 'required|string',
        ]);

        $queryStr = trim($request->input('query'));

        $application = MutationApplication::with(['student', 'schoolOrigin', 'schoolDestination', 'letter'])
            ->where('registration_number', $queryStr)
            ->orWhereHas('student', function ($q) use ($queryStr) {
                $q->where('nisn', $queryStr);
            })
            ->first();

        if (!$application) {
            return response()->json([
                'found' => false,
                'message' => 'Pengajuan tidak ditemukan dengan nomor registrasi atau NISN tersebut.',
            ]);
        }

        return response()->json([
            'found' => true,
            'application' => [
                'registration_number' => $application->registration_number,
                'type' => $application->type,
                'student_name' => $application->student->name,
                'nisn' => $application->student->nisn,
                'school_origin' => $application->school_origin_name,
                'school_destination' => $application->school_destination_name,
                'status' => $application->status,
                'submitted_at' => $application->submitted_at ? $application->submitted_at->isoFormat('D MMMM Y') : null,
                'rejection_note' => $application->status === 'Dikembalikan' ? $application->rejection_note : null,
                'has_letter' => (bool)$application->letter,
                'download_url' => $application->letter ? route('mutation.download_letter', $application->id) : null,
            ],
        ]);
    }
}
