import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  ArrowLeft, 
  ArrowRightLeft, 
  Upload, 
  CheckCircle2, 
  FileText, 
  AlertCircle,
  Building2,
  RotateCcw
} from 'lucide-react';

export default function MutationEdit({ application, schools, userSchool }) {
  const { data, setData, post, processing, errors } = useForm({
    _method: 'POST',
    type: application.type || 'Masuk',
    nisn: application.student?.nisn || '',
    name: application.student?.name || '',
    destination_class: application.destination_class || 'Kelas 4',
    school_origin_name: application.school_origin_name || '',
    school_origin_npsn: application.school_origin_npsn || '',
    school_destination_name: application.school_destination_name || '',
    school_destination_npsn: application.school_destination_npsn || '',
    reason: application.reason || '',
    surat_pindah: null,
    rapor: null,
    kk: null,
  });

  const [previews, setPreviews] = useState({
    surat_pindah: null,
    rapor: null,
    kk: null,
  });

  const handleTypeSelect = (selectedType) => {
    setData('type', selectedType);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setData(field, file);
      setPreviews((prev) => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('mutation.update', application.id));
  };

  return (
    <AuthenticatedLayout title="Edit & Perbaiki Pengajuan Mutasi">
      <Head title={`Edit Pengajuan #${application.registration_number} - SIMUTASI`} />

      {/* Top Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={route('mutation.show', application.id)} className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Detail Pengajuan
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Perbaiki Pengajuan Mutasi #{application.registration_number}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Edit data siswa, informasi sekolah, atau unggah dokumen pengganti secara langsung tanpa perlu membuat pengajuan baru.
          </p>
        </div>
      </div>

      {/* Warning Box for Rejection Note */}
      {application.rejection_note && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs shadow-xs">
          <h4 className="font-bold flex items-center gap-2 mb-1 text-amber-800">
            <RotateCcw className="w-4 h-4" /> Catatan Perbaikan dari Admin Dinas:
          </h4>
          <p className="ml-6 font-semibold">{application.rejection_note}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Error Notification Alert Banner */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-900 p-4 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-rose-900">Perbaikan Belum Dapat Disimpan</h4>
              <p className="text-xs text-rose-700 font-medium">
                Silakan periksa kembali pesan kesalahan di bawah ini:
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
              onClick={() => handleTypeSelect('Masuk')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                data.type === 'Masuk' ? 'border-sky-600 bg-sky-50/50 text-sky-950 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="type" checked={data.type === 'Masuk'} onChange={() => {}} className="text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm">Mutasi Masuk</h3>
                  <p className="text-xs text-slate-500">Pindah masuk ke sekolah ini</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-sky-600" />
            </label>

            <label
              onClick={() => handleTypeSelect('Keluar')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                data.type === 'Keluar' ? 'border-sky-600 bg-sky-50/50 text-sky-950 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="type" checked={data.type === 'Keluar'} onChange={() => {}} className="text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm">Mutasi Keluar</h3>
                  <p className="text-xs text-slate-500">Pindah keluar dari sekolah ini</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            </label>
          </div>
        </div>

        {/* 2. Data Siswa & Sekolah Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">2</span>
            Edit Data Siswa & Sekolah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NISN Siswa *</label>
              <input
                type="text"
                maxLength={10}
                value={data.nisn}
                onChange={(e) => setData('nisn', e.target.value)}
                placeholder="Masukkan 10 digit NISN"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
                required
              />
              {errors.nisn && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.nisn}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nama lengkap sesuai dokumen"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
                required
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat / Kelas Tujuan *</label>
              <select
                value={data.destination_class}
                onChange={(e) => setData('destination_class', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
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
            </div>

            {/* Sekolah Asal Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-sky-600" />
                Sekolah Asal
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Sekolah Asal *</label>
                <input
                  type="text"
                  value={data.school_origin_name}
                  onChange={(e) => setData('school_origin_name', e.target.value)}
                  placeholder="Contoh: SDN 1 Lembang"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-600 focus:outline-none"
                  required
                />
                {errors.school_origin_name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_origin_name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">NPSN Sekolah Asal</label>
                <input
                  type="text"
                  maxLength={10}
                  value={data.school_origin_npsn}
                  onChange={(e) => setData('school_origin_npsn', e.target.value)}
                  placeholder="Contoh: 20200001"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Sekolah Tujuan Details */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Sekolah Tujuan
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Sekolah Tujuan *</label>
                <input
                  type="text"
                  value={data.school_destination_name}
                  onChange={(e) => setData('school_destination_name', e.target.value)}
                  placeholder="Contoh: SMPN 2 Ngamprah"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-600 focus:outline-none"
                  required
                />
                {errors.school_destination_name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_destination_name}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">NPSN Sekolah Tujuan</label>
                <input
                  type="text"
                  maxLength={10}
                  value={data.school_destination_npsn}
                  onChange={(e) => setData('school_destination_npsn', e.target.value)}
                  placeholder="Contoh: 20200002"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-600 focus:outline-none"
                />
              </div>
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

        {/* 3. Unggah Ulang Dokumen Section (Opsional jika ingin mengganti file) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">3</span>
              Perbarui Dokumen Persyaratan (Opsional)
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">Pilih file baru jika ada perbaikan dokumen</span>
          </div>

          {/* List current documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {application.documents?.map((doc) => (
              <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-900">{doc.document_label}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{doc.original_name}</p>
                <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-bold bg-slate-200 text-slate-700">
                  {doc.is_valid === false ? '❌ Perlu Diganti' : doc.is_valid === true ? '✅ Sesuai' : 'Dokumen Lama'}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unggah Baru: Surat Keterangan Pindah</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-3 text-center bg-slate-50/50 relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'surat_pindah')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-xs font-semibold text-sky-600">
                  {previews.surat_pindah ? `📄 ${previews.surat_pindah}` : 'Klik untuk ganti file Surat Pindah'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unggah Baru: Fotokopi Rapor (Legalisir)</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-3 text-center bg-slate-50/50 relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'rapor')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-xs font-semibold text-sky-600">
                  {previews.rapor ? `📄 ${previews.rapor}` : 'Klik untuk ganti file Fotokopi Rapor'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unggah Baru: Kartu Keluarga (KK)</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-sky-500 rounded-xl p-3 text-center bg-slate-50/50 relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'kk')}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                <p className="text-xs font-semibold text-sky-600">
                  {previews.kk ? `📄 ${previews.kk}` : 'Klik untuk ganti file Kartu Keluarga'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Box */}
        <div className="bg-sky-50 border border-sky-200 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-sky-950">Simpan & Ajukan Ulang</h3>
            <p className="text-xs text-sky-700">Perubahan akan disimpan dan status pengajuan kembali menjadi 'Diajukan' untuk diverifikasi ulang.</p>
          </div>
          <button
            type="submit"
            disabled={processing}
            className="px-6 py-3 bg-sky-700 hover:bg-sky-800 active:bg-sky-900 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {processing ? 'Menyimpan...' : 'Simpan Perubahan & Ajukan Ulang'}
          </button>
        </div>
      </form>
    </AuthenticatedLayout>
  );
}
