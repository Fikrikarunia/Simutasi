import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  ArrowLeft, 
  ArrowRightLeft, 
  Upload, 
  CheckCircle2, 
  FileText, 
  AlertCircle 
} from 'lucide-react';

export default function MutationCreate({ schools, userSchool }) {
  const { data, setData, post, processing, errors } = useForm({
    type: 'Masuk',
    nisn: '',
    name: '',
    destination_class: 'Kelas 4',
    school_origin_name: '',
    school_destination_name: userSchool ? userSchool.name : 'SD Negeri Bandung Barat',
    reason: '',
    surat_pindah: null,
    rapor: null,
    kk: null,
  });

  const [previews, setPreviews] = useState({
    surat_pindah: null,
    rapor: null,
    kk: null,
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      setPreviews((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('mutation.store'));
  };

  return (
    <AuthenticatedLayout title="Pengajuan Mutasi Siswa">
      <Head title="Pengajuan Mutasi Siswa - SIMUTASI" />

      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pengajuan Mutasi Siswa</h1>
          <p className="text-xs text-slate-500 mt-1">
            Lengkapi formulir di bawah ini untuk mengajukan permohonan mutasi masuk atau keluar.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Error Notification Alert Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-900 p-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-rose-900">Pengajuan Belum Dapat Dikirim</h4>
              <p className="text-xs text-rose-700 font-medium">
                Terdapat beberapa bidang atau dokumen persyaratan yang belum diisi atau tidak sesuai. Silakan periksa pesan di bawah:
              </p>
              <ul className="list-disc list-inside text-xs text-rose-700 space-y-0.5 pt-1">
                {Object.entries(errors).map(([key, msg]) => (
                  <li key={key} className="font-semibold">{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 1. Jenis Mutasi Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">1</span>
            Jenis Mutasi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              onClick={() => {
                setData('type', 'Masuk');
                setData('school_destination_name', userSchool ? userSchool.name : 'SD Negeri Bandung Barat');
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                data.type === 'Masuk' ? 'border-sky-600 bg-sky-50/50 text-sky-950 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="type" checked={data.type === 'Masuk'} onChange={() => {}} className="text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm">Mutasi Masuk</h3>
                  <p className="text-xs text-slate-500">Pindah masuk ke {userSchool?.name || 'sekolah ini'}</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-sky-600" />
            </label>

            <label
              onClick={() => {
                setData('type', 'Keluar');
                setData('school_origin_name', userSchool ? userSchool.name : 'SD Negeri Bandung Barat');
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                data.type === 'Keluar' ? 'border-sky-600 bg-sky-50/50 text-sky-950 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="type" checked={data.type === 'Keluar'} onChange={() => {}} className="text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm">Mutasi Keluar</h3>
                  <p className="text-xs text-slate-500">Pindah keluar dari {userSchool?.name || 'sekolah ini'}</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            </label>
          </div>
          {errors.type && <p className="text-[11px] text-rose-600 mt-2 font-medium">{errors.type}</p>}
        </div>

        {/* 2. Data Siswa Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">2</span>
            Data Siswa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NISN *</label>
              <input
                type="text"
                maxLength={10}
                value={data.nisn}
                onChange={(e) => setData('nisn', e.target.value)}
                placeholder="Masukkan 10 digit NISN"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.nisn 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
                required
              />
              {errors.nisn && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.nisn}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nama lengkap sesuai dokumen"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.name 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
                required
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas Tujuan *</label>
              <select
                value={data.destination_class}
                onChange={(e) => setData('destination_class', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.destination_class 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
              >
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
                <option value="Kelas 7">Kelas 7 (SMP)</option>
                <option value="Kelas 8">Kelas 8 (SMP)</option>
                <option value="Kelas 9">Kelas 9 (SMP)</option>
              </select>
              {errors.destination_class && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.destination_class}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sekolah Asal *</label>
              <input
                type="text"
                value={data.school_origin_name}
                onChange={(e) => setData('school_origin_name', e.target.value)}
                placeholder="Nama sekolah asal"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.school_origin_name 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
                required
              />
              {errors.school_origin_name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_origin_name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Sekolah Tujuan *</label>
              <input
                type="text"
                value={data.school_destination_name}
                onChange={(e) => setData('school_destination_name', e.target.value)}
                placeholder="Nama sekolah tujuan"
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.school_destination_name 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
                required
              />
              {errors.school_destination_name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_destination_name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Mutasi</label>
              <textarea
                rows={2}
                value={data.reason}
                onChange={(e) => setData('reason', e.target.value)}
                placeholder="Contoh: Pindah domisili orang tua ke Cisarua"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 3. Unggah Dokumen Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">3</span>
              Unggah Dokumen
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Format: PDF, JPG, PNG. Max 2MB</span>
          </div>

          <div className="space-y-4">
            {/* File 1: Surat Keterangan Pindah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surat Keterangan Pindah *</label>
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                errors.surat_pindah 
                  ? 'border-rose-400 bg-rose-50/40 hover:bg-rose-50/70' 
                  : 'border-slate-200 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'surat_pindah')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className={`w-6 h-6 mx-auto mb-1 ${errors.surat_pindah ? 'text-rose-500' : 'text-slate-400'}`} />
                <p className={`text-xs font-semibold ${errors.surat_pindah ? 'text-rose-700' : 'text-sky-600'}`}>
                  {previews.surat_pindah ? `📄 ${previews.surat_pindah}` : 'Klik untuk mengunggah atau seret file Surat Pindah ke sini'}
                </p>
              </div>
              {errors.surat_pindah && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.surat_pindah}</p>}
            </div>

            {/* File 2: Fotokopi Rapor */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fotokopi Rapor (Halaman Biodata & Nilai Terakhir) *</label>
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                errors.rapor 
                  ? 'border-rose-400 bg-rose-50/40 hover:bg-rose-50/70' 
                  : 'border-slate-200 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'rapor')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className={`w-6 h-6 mx-auto mb-1 ${errors.rapor ? 'text-rose-500' : 'text-slate-400'}`} />
                <p className={`text-xs font-semibold ${errors.rapor ? 'text-rose-700' : 'text-sky-600'}`}>
                  {previews.rapor ? `📄 ${previews.rapor}` : 'Klik untuk mengunggah atau seret file Fotokopi Rapor ke sini'}
                </p>
              </div>
              {errors.rapor && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.rapor}</p>}
            </div>

            {/* File 3: Kartu Keluarga */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kartu Keluarga (KK) *</label>
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all cursor-pointer relative ${
                errors.kk 
                  ? 'border-rose-400 bg-rose-50/40 hover:bg-rose-50/70' 
                  : 'border-slate-200 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/30'
              }`}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'kk')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className={`w-6 h-6 mx-auto mb-1 ${errors.kk ? 'text-rose-500' : 'text-slate-400'}`} />
                <p className={`text-xs font-semibold ${errors.kk ? 'text-rose-700' : 'text-sky-600'}`}>
                  {previews.kk ? `📄 ${previews.kk}` : 'Klik untuk mengunggah atau seret file Kartu Keluarga (KK) ke sini'}
                </p>
              </div>
              {errors.kk && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.kk}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Submit Confirmation Box */}
        <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-sky-950">Konfirmasi Pengajuan</h3>
            <p className="text-xs text-sky-700">Pastikan semua data dan dokumen telah sesuai sebelum mengirim pengajuan.</p>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
