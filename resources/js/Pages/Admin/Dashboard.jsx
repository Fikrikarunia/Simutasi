import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  FileText, 
  CheckCircle2, 
  RotateCcw, 
  Mail, 
  Search, 
  Filter, 
  Eye, 
  CheckSquare, 
  FilePlus, 
  Upload 
} from 'lucide-react';

export default function AdminDashboard({ stats, applications, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [type, setType] = useState(filters?.type || 'Semua Jenis');
  const [status, setStatus] = useState(filters?.status || 'Semua Status');

  const handleFilter = () => {
    router.get(route('dashboard'), { search, type, status }, { preserveState: true });
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Diajukan':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-semibold text-xs border border-slate-200">Diajukan</span>;
      case 'Diverifikasi':
        return <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-md font-semibold text-xs border border-sky-200">Diverifikasi</span>;
      case 'Dikembalikan':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md font-semibold text-xs border border-amber-200">Dikembalikan</span>;
      case 'Surat Diproses':
        return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-md font-semibold text-xs border border-purple-200">Surat Diproses</span>;
      case 'Selesai':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-xs border border-emerald-200">Selesai</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-semibold text-xs">{st}</span>;
    }
  };

  return (
    <AuthenticatedLayout title="Dashboard Manajemen Verifikasi">
      <Head title="Dashboard Admin Dinas - SIMUTASI" />

      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Manajemen Verifikasi</h1>
        <p className="text-sm text-slate-500 mt-1">Dinas Pendidikan Kabupaten Bandung Barat - Verifikasi & Penerbitan Surat Digital</p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.menunggu_verifikasi}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Menunggu Verifikasi</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.selesai_hari_ini}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Selesai Hari Ini</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.dikembalikan}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Dikembalikan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-slate-900">{stats.surat_antri}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Surat Digital Antri</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8">
        {/* Table Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-base font-bold text-slate-900">Daftar Pengajuan Mutasi</h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Nama Sekolah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-sky-500"
              />
            </div>

            <select
              value={type}
              onChange={(e) => { setType(e.target.value); router.get(route('dashboard'), { search, type: e.target.value, status }); }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Semua Jenis">Semua Jenis</option>
              <option value="Masuk">Masuk</option>
              <option value="Keluar">Keluar</option>
            </select>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); router.get(route('dashboard'), { search, type, status: e.target.value }); }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Diajukan">Diajukan</option>
              <option value="Diverifikasi">Diverifikasi</option>
              <option value="Dikembalikan">Dikembalikan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Sekolah Asal / Tujuan</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.data.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    Belum ada pengajuan mutasi ditemukan.
                  </td>
                </tr>
              ) : (
                applications.data.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-all">
                    <td className="py-3.5 px-4 font-bold text-slate-900">#{app.registration_number}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.student?.name}</p>
                      <p className="text-[11px] text-slate-500">NISN: {app.student?.nisn}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">
                        {app.school_origin_name}
                        {app.school_origin_npsn && <span className="text-[10px] text-slate-400 font-normal"> (NPSN: {app.school_origin_npsn})</span>}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        ➔ {app.school_destination_name}
                        {app.school_destination_npsn && <span className="text-[10px] text-slate-400 font-normal"> (NPSN: {app.school_destination_npsn})</span>}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{app.type}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={route('mutation.show', app.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                            app.status === 'Diajukan'
                              ? 'bg-sky-600 hover:bg-sky-700 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {app.status === 'Diajukan' ? (
                            <>
                              <CheckSquare className="w-3.5 h-3.5" />
                              Verifikasi
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              Detail
                            </>
                          )}
                        </Link>
                        {app.status === 'Selesai' && app.letter && (
                          <a
                            href={route('mutation.download_letter', app.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-xs inline-flex items-center gap-1"
                            title="Unduh Surat Digital"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Surat PDF
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

        {/* Table Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span>Menampilkan 1-{applications.data.length} dari {applications.total} data</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-200">
              Sebelumnya
            </button>
            <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-medium shadow-xs">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Card Section: Manajemen Surat Digital */}
      <div className="bg-slate-100/60 rounded-2xl border border-slate-200/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Manajemen Surat Digital</h3>
            <p className="text-xs text-slate-500">Generate dan unggah surat keterangan persetujuan mutasi.</p>
          </div>
          <span className="text-xs font-bold text-sky-600 cursor-pointer hover:underline">Lihat Semua ➔</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Surat Rekomendasi Masuk</h4>
                <p className="text-[11px] text-slate-500">15 Menunggu Dibuat</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer">
              Generate
            </button>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900">Surat Rekomendasi Keluar</h4>
                <p className="text-[11px] text-slate-500">8 Menunggu Ditandatangani</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-bold text-xs transition-all cursor-pointer">
              Unggah TTD
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
