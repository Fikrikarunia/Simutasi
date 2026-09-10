import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  Plus, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Download 
} from 'lucide-react';

export default function OperatorDashboard({ stats, applications, school }) {
  const getStatusBadge = (st) => {
    switch (st) {
      case 'Diajukan':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-xs border border-slate-200">Diajukan</span>;
      case 'Diverifikasi':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-md font-semibold text-xs border border-sky-200">Diverifikasi</span>;
      case 'Dikembalikan':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-semibold text-xs border border-amber-200">Dikembalikan</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-xs border border-emerald-200">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-semibold text-xs">{st}</span>;
    }
  };

  return (
    <AuthenticatedLayout title="Dashboard Operator Sekolah">
      <Head title="Dashboard Operator - SIMUTASI" />

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Selamat Datang, Operator!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            <strong className="text-slate-800">{school?.name || 'SD Negeri Bandung Barat'}</strong> - Pantau dan kelola pengajuan mutasi siswa.
          </p>
        </div>

        <Link
          href={route('mutation.create')}
          className="inline-flex items-center gap-2 px-5 py-3 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengajuan
        </Link>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900">{stats.total_pengajuan}</span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Total Pengajuan</p>
            <p className="text-[11px] text-slate-400">Tahun ajaran ini</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-slate-900">{stats.menunggu_verifikasi}</span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Menunggu Verifikasi</p>
            <p className="text-[11px] text-slate-400">Butuh aksi dari dinas</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-rose-600">{stats.perlu_perbaikan}</span>
            <p className="text-xs font-semibold text-rose-700 mt-1">Perlu Perbaikan</p>
            <p className="text-[11px] text-rose-400">Dokumen tidak lengkap</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-emerald-600">{stats.selesai}</span>
            <p className="text-xs font-semibold text-slate-700 mt-1">Selesai</p>
            <p className="text-[11px] text-emerald-600 font-medium">Mutasi berhasil</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Pengajuan Mutasi Terbaru</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">No. Registrasi</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Jenis Mutasi</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    Belum ada pengajuan mutasi dari sekolah Anda.
                  </td>
                </tr>
              ) : (
                applications.data.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.registration_number}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.student?.name}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{app.type}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(app.submitted_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {app.status === 'Dikembalikan' && (
                          <Link
                            href={route('mutation.edit', app.id)}
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Edit Perbaikan
                          </Link>
                        )}
                        <Link
                          href={route('mutation.show', app.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all border border-slate-200 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Detail
                        </Link>
                        {app.status === 'Selesai' && app.letter && (
                          <a
                            href={route('mutation.download_letter', app.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs inline-flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Unduh Surat
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
