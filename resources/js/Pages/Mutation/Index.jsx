import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Search, Filter, Eye, Download, Plus } from 'lucide-react';

export default function MutationIndex({ applications, filters }) {
  const [search, setSearch] = useState(filters?.search || '');
  const [type, setType] = useState(filters?.type || 'semua');
  const [status, setStatus] = useState(filters?.status || 'semua');

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('mutation.index'), { search, type, status }, { preserveState: true });
  };

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
    <AuthenticatedLayout title="Daftar Pengajuan Mutasi">
      <Head title="Daftar Pengajuan Mutasi - SIMUTASI" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Daftar Pengajuan Mutasi</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola dan pantau seluruh permohonan mutasi peserta didik KBB.</p>
        </div>

        <Link
          href={route('mutation.create')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold text-xs shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Pengajuan
        </Link>
      </div>

      {/* Filter Card */}
      <form onSubmit={handleSearch} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama Siswa, NISN, atau No. Registrasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); router.get(route('mutation.index'), { search, type: e.target.value, status }); }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="semua">Semua Jenis</option>
            <option value="masuk">Mutasi Masuk</option>
            <option value="keluar">Mutasi Keluar</option>
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); router.get(route('mutation.index'), { search, type, status: e.target.value }); }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="semua">Semua Status</option>
            <option value="Diajukan">Diajukan</option>
            <option value="Diverifikasi">Diverifikasi</option>
            <option value="Dikembalikan">Dikembalikan</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-4">No. Registrasi</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Sekolah Asal / Tujuan</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium">
                    Tidak ada pengajuan mutasi ditemukan.
                  </td>
                </tr>
              ) : (
                applications.data.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-all">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{app.registration_number}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.student?.name}</p>
                      <p className="text-[11px] text-slate-500">NISN: {app.student?.nisn}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{app.type}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{app.school_origin_name}</p>
                      <p className="text-[11px] text-slate-500">➔ {app.school_destination_name}</p>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(app.submitted_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={route('mutation.show', app.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-all border border-slate-200 inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detail
                        </Link>
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
