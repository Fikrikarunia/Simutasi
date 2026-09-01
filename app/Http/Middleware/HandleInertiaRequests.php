<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'school_id' => $request->user()->school_id,
                    'school' => $request->user()->school,
                ] : null,
            ],
            'notifications' => fn () => $request->user() ? $this->getNotifications($request->user()) : [],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    protected function getNotifications($user): array
    {
        if (!$user) {
            return [];
        }

        $notifications = [];

        if ($user->isAdminDinas() || $user->isSuperAdmin()) {
            $apps = \App\Models\MutationApplication::with(['student'])
                ->orderBy('updated_at', 'desc')
                ->take(10)
                ->get();

            foreach ($apps as $app) {
                $studentName = $app->student ? $app->student->name : 'Siswa';
                if ($app->status === 'Diajukan') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Pengajuan Menunggu Verifikasi',
                        'message' => "Pengajuan Mutasi {$app->type} #{$app->registration_number} ({$studentName}) membutuhkan verifikasi berkas.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'warning',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Diverifikasi') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Berkas Valid - Siap Terbitkan Surat',
                        'message' => "Berkas #{$app->registration_number} ({$studentName}) telah disetujui. Siap diterbitkan Surat Mutasi Digital.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'info',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Dikembalikan') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Pengajuan Dikembalikan ke Operator',
                        'message' => "Pengajuan #{$app->registration_number} ({$studentName}) dikembalikan dengan catatan revisi.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'danger',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Selesai') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Surat Mutasi Diterbitkan',
                        'message' => "Surat Mutasi Digital #{$app->registration_number} ({$studentName}) berhasil diterbitkan.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'success',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                }
            }
        } else {
            // Operator Sekolah
            $schoolId = $user->school_id;
            $apps = \App\Models\MutationApplication::with(['student'])
                ->where(function($q) use ($schoolId) {
                    $q->where('school_origin_id', $schoolId)->orWhere('school_destination_id', $schoolId);
                })
                ->orderBy('updated_at', 'desc')
                ->take(10)
                ->get();

            foreach ($apps as $app) {
                $studentName = $app->student ? $app->student->name : 'Siswa';
                if ($app->status === 'Dikembalikan') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Perlu Perbaikan Dokumen',
                        'message' => "Pengajuan #{$app->registration_number} ({$studentName}) dikembalikan oleh Dinas. Catatan: " . ($app->rejection_note ?: 'Periksa kembali kelengkapan berkas.'),
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'danger',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Selesai') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Surat Mutasi Siap Diunduh',
                        'message' => "Surat Keterangan Mutasi Digital untuk {$studentName} (#{$app->registration_number}) telah terbit dan siap diunduh.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'success',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Diverifikasi') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Berkas Disetujui Dinas',
                        'message' => "Pengajuan #{$app->registration_number} ({$studentName}) telah disetujui Dinas. Menunggu proses penerbitan surat.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'info',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                } elseif ($app->status === 'Diajukan') {
                    $notifications[] = [
                        'id' => 'notif-app-' . $app->id,
                        'title' => 'Dalam Antrean Verifikasi',
                        'message' => "Pengajuan #{$app->registration_number} ({$studentName}) telah terkirim dan berada dalam antrean verifikasi Dinas.",
                        'time' => $app->updated_at ? $app->updated_at->diffForHumans() : 'baru saja',
                        'timestamp' => $app->updated_at ? $app->updated_at->timestamp : time(),
                        'type' => 'warning',
                        'url' => route('mutation.show', $app->id),
                        'application_id' => $app->id,
                    ];
                }
            }
        }

        usort($notifications, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });

        return $notifications;
    }
}
