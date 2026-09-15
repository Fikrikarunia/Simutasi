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
  MapPin,
  Globe
} from 'lucide-react';

export default function MutationCreate({ schools, userSchool }) {
  const originSchoolName = userSchool ? userSchool.name : '';
  const originSchoolNpsn = userSchool ? (userSchool.npsn || '') : '';

  const { data, setData, post, processing, errors } = useForm({
    type: 'Keluar',
    destination_region: 'dalam', // 'dalam' | 'luar'
    destination_city: '',
    origin_region: 'dalam', // 'dalam' | 'luar'
    origin_city: '',
    nisn: '',
    name: '',
    destination_class: 'Kelas 4',
    school_origin_name: originSchoolName,
    school_origin_npsn: originSchoolNpsn,
    school_destination_name: '',
    school_destination_npsn: '',
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

  const handleTypeSelect = (selectedType) => {
    if (selectedType === 'Keluar') {
      setData((prev) => ({
        ...prev,
        type: 'Keluar',
        destination_region: 'dalam',
        destination_city: '',
        school_origin_name: originSchoolName,
        school_origin_npsn: originSchoolNpsn,
        school_destination_name: '',
        school_destination_npsn: '',
      }));
    } else {
      setData((prev) => ({
        ...prev,
        type: 'Masuk',
        origin_region: 'dalam',
        origin_city: '',
        school_destination_name: originSchoolName,
        school_destination_npsn: originSchoolNpsn,
        school_origin_name: '',
        school_origin_npsn: '',
      }));
    }
  };

  const handleDestinationChange = (e) => {
    const val = e.target.value;
    const matched = schools ? schools.find((s) => s.name.toLowerCase() === val.toLowerCase()) : null;
    setData((prev) => ({
      ...prev,
      school_destination_name: val,
      school_destination_npsn: matched ? matched.npsn : prev.school_destination_npsn,
    }));
  };

  const handleOriginChange = (e) => {
    const val = e.target.value;
    const matched = schools ? schools.find((s) => s.name.toLowerCase() === val.toLowerCase()) : null;
    setData((prev) => ({
      ...prev,
      school_origin_name: val,
      school_origin_npsn: matched ? matched.npsn : prev.school_origin_npsn,
    }));
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
              onClick={() => handleTypeSelect('Keluar')}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                data.type === 'Keluar' ? 'border-sky-600 bg-sky-50/50 text-sky-950 shadow-xs' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="type" checked={data.type === 'Keluar'} onChange={() => {}} className="text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm">Mutasi Keluar</h3>
                  <p className="text-xs text-slate-500">Pindah keluar dari {originSchoolName || 'sekolah Anda'}</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-amber-500" />
            </label>

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
                  <p className="text-xs text-slate-500">Pindah masuk siswa</p>
                </div>
              </div>
              <ArrowRightLeft className="w-5 h-5 text-sky-600" />
            </label>
          </div>
          {errors.type && <p className="text-[11px] text-rose-600 mt-2 font-medium">{errors.type}</p>}
        </div>

        {/* 2. Data Siswa & Sekolah Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">2</span>
            Data Siswa & Sekolah
          </h2>

          {/* Baris 1: NISN Siswa & Sekolah Tujuan dibarengkan sesuai instruksi */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-2">
              <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-600" />
                NISN Siswa & Sekolah Tujuan
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-sky-200/70 text-sky-900 font-bold rounded-full">
                Form Utama
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NISN Siswa *
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={data.nisn}
                  onChange={(e) => setData('nisn', e.target.value)}
                  placeholder="Masukkan 10 digit NISN siswa"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                    errors.nisn 
                      ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                      : 'bg-white border border-slate-200 focus:border-sky-600 shadow-xs'
                  }`}
                  required
                />
                {errors.nisn && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.nisn}</p>}
                <p className="text-[11px] text-slate-400 mt-1">10 digit nomor induk siswa nasional.</p>
              </div>

              {/* Sekolah Tujuan */}
              <div>
                {data.type === 'Keluar' ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Sekolah Tujuan *
                      </label>
                      {/* Toggle Wilayah Tujuan: Dalam vs Luar KBB */}
                      <div className="inline-flex p-0.5 bg-sky-100/90 rounded-lg text-[10px] font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ 
                              ...prev, 
                              destination_region: 'dalam', 
                              school_destination_name: '', 
                              school_destination_npsn: '', 
                              destination_city: '' 
                            }));
                          }}
                          className={`px-2.5 py-0.5 rounded-md transition-all ${
                            data.destination_region === 'dalam'
                              ? 'bg-white text-sky-900 shadow-xs'
                              : 'text-sky-700 hover:text-sky-950'
                          }`}
                        >
                          Dalam KBB
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setData((prev) => ({ 
                              ...prev, 
                              destination_region: 'luar', 
                              school_destination_name: '', 
                              school_destination_npsn: '', 
                              destination_city: '' 
                            }));
                          }}
                          className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                            data.destination_region === 'luar'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-sky-700 hover:text-sky-950'
                          }`}
                        >
                          <Globe className="w-2.5 h-2.5" /> Luar KBB
                        </button>
                      </div>
                    </div>

                    {data.destination_region === 'dalam' ? (
                      <div>
                        <div className="relative">
                          <input
                            list="schools-destination-list"
                            type="text"
                            value={data.school_destination_name}
                            onChange={handleDestinationChange}
                            placeholder="Pilih atau cari SD / SMP di Bandung Barat..."
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                              errors.school_destination_name 
                                ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                                : 'bg-white border border-slate-200 focus:border-sky-600 shadow-xs'
                            }`}
                            required
                          />
                          <datalist id="schools-destination-list">
                            {schools && schools.map((sch) => (
                              <option key={sch.id} value={sch.name}>
                                {sch.jenjang} - NPSN: {sch.npsn} - Kec. {sch.kecamatan || '-'}
                              </option>
                            ))}
                          </datalist>
                        </div>
                        {errors.school_destination_name && (
                          <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_destination_name}</p>
                        )}
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-medium">NPSN Tujuan:</span>
                          <input
                            type="text"
                            maxLength={10}
                            value={data.school_destination_npsn}
                            onChange={(e) => setData('school_destination_npsn', e.target.value)}
                            placeholder="NPSN (otomatis dari pilihan)"
                            className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700 focus:border-sky-600 focus:outline-none"
                          />
                        </div>
                        {errors.school_destination_npsn && (
                          <p className="text-[11px] text-rose-600 mt-0.5 font-semibold">{errors.school_destination_npsn}</p>
                        )}
                      </div>
                    ) : (
                      /* Form Pengisian Sekolah Luar Kab. Bandung Barat */
                      <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl space-y-2 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-[11px] text-amber-900 font-bold border-b border-amber-200/60 pb-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-600" /> Sekolah Luar Kab. Bandung Barat
                          </span>
                          <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                            Luar Daerah
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Nama Sekolah Tujuan *</label>
                          <input
                            type="text"
                            value={data.school_destination_name}
                            onChange={(e) => setData('school_destination_name', e.target.value)}
                            placeholder="Contoh: SMP Negeri 1 Cimahi / SDN 01 Menteng"
                            className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium text-slate-800 bg-white border focus:outline-none transition-all ${
                              errors.school_destination_name ? 'border-rose-400 focus:border-rose-600' : 'border-amber-200 focus:border-amber-500 shadow-xs'
                            }`}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Kota / Kab & Provinsi Tujuan *</label>
                            <input
                              type="text"
                              value={data.destination_city}
                              onChange={(e) => setData('destination_city', e.target.value)}
                              placeholder="Contoh: Kota Cimahi, Jawa Barat"
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-800 bg-white border border-amber-200 focus:border-amber-500 focus:outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-0.5">NPSN Tujuan (Opsional)</label>
                            <input
                              type="text"
                              maxLength={10}
                              value={data.school_destination_npsn}
                              onChange={(e) => setData('school_destination_npsn', e.target.value)}
                              placeholder="NPSN (jika ada)"
                              className="w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-800 bg-white border border-amber-200 focus:border-amber-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <p className="text-[10px] text-amber-700 leading-tight">
                          Ketik nama sekolah dan kota/kabupaten tujuan di luar KBB secara lengkap untuk Surat Rekomendasi Mutasi Dinas.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Mutasi Masuk: Sekolah Tujuan adalah Sekolah Pengguna (Otomatis) */
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Sekolah Tujuan (Penerima) *</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                        Otomatis Sekolah Anda
                      </span>
                    </label>
                    <input
                      type="text"
                      value={data.school_destination_name}
                      readOnly
                      className="w-full px-3.5 py-2.5 bg-slate-200/70 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                    />
                    {data.school_destination_npsn && (
                      <p className="text-[11px] text-slate-500 mt-1 font-medium">NPSN: {data.school_destination_npsn}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Baris 2: Nama Siswa & Tingkat Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nama lengkap sesuai dokumen rapor / akta"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat / Kelas Tujuan *</label>
              <select
                value={data.destination_class}
                onChange={(e) => setData('destination_class', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-800 focus:outline-none transition-all ${
                  errors.destination_class 
                    ? 'bg-rose-50/50 border-2 border-rose-300 focus:border-rose-600' 
                    : 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-sky-600'
                }`}
              >
                <option value="Kelas 1">Kelas 1 (SD)</option>
                <option value="Kelas 2">Kelas 2 (SD)</option>
                <option value="Kelas 3">Kelas 3 (SD)</option>
                <option value="Kelas 4">Kelas 4 (SD)</option>
                <option value="Kelas 5">Kelas 5 (SD)</option>
                <option value="Kelas 6">Kelas 6 (SD)</option>
                <option value="Kelas 7">Kelas 7 (SMP)</option>
                <option value="Kelas 8">Kelas 8 (SMP)</option>
                <option value="Kelas 9">Kelas 9 (SMP)</option>
              </select>
              {errors.destination_class && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.destination_class}</p>}
            </div>
          </div>

          {/* Baris 3: Sekolah Asal (Pengirim) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                Sekolah Asal (Pengirim)
              </span>
              {data.type === 'Keluar' ? (
                <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                  Otomatis Akun Operator Sekolah
                </span>
              ) : (
                /* Toggle Wilayah Asal untuk Mutasi Masuk */
                <div className="inline-flex p-0.5 bg-slate-200/80 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setData((prev) => ({ 
                        ...prev, 
                        origin_region: 'dalam', 
                        school_origin_name: '', 
                        school_origin_npsn: '', 
                        origin_city: '' 
                      }));
                    }}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      data.origin_region === 'dalam'
                        ? 'bg-white text-emerald-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Dari Dalam KBB
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData((prev) => ({ 
                        ...prev, 
                        origin_region: 'luar', 
                        school_origin_name: '', 
                        school_origin_npsn: '', 
                        origin_city: '' 
                      }));
                    }}
                    className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                      data.origin_region === 'luar'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Globe className="w-2.5 h-2.5" /> Dari Luar KBB
                  </button>
                </div>
              )}
            </div>

            {data.type === 'Keluar' ? (
              /* Mutasi Keluar: Sekolah Asal = Akun Sekolah Login */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Sekolah Asal *</label>
                  <input
                    type="text"
                    value={data.school_origin_name}
                    readOnly
                    placeholder="Nama sekolah asal"
                    className="w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-200/70 border border-slate-300"
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
                    readOnly
                    placeholder="NPSN sekolah asal"
                    className="w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-200/70 border border-slate-300"
                  />
                </div>
              </div>
            ) : (
              /* Mutasi Masuk: Sekolah Asal diisi oleh operator */
              data.origin_region === 'dalam' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pilih Sekolah Asal di Kab. Bandung Barat *</label>
                    <input
                      list="schools-origin-list"
                      type="text"
                      value={data.school_origin_name}
                      onChange={handleOriginChange}
                      placeholder="Pilih atau cari SD / SMP asal di KBB..."
                      className="w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-200 focus:border-emerald-600 focus:outline-none"
                      required
                    />
                    <datalist id="schools-origin-list">
                      {schools && schools.map((sch) => (
                        <option key={sch.id} value={sch.name}>
                          {sch.jenjang} - NPSN: {sch.npsn} - Kec. {sch.kecamatan || '-'}
                        </option>
                      ))}
                    </datalist>
                    {errors.school_origin_name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.school_origin_name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">NPSN Sekolah Asal</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={data.school_origin_npsn}
                      onChange={(e) => setData('school_origin_npsn', e.target.value)}
                      placeholder="NPSN (otomatis dari pilihan)"
                      className="w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-white border border-slate-200 focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                /* Mutasi Masuk dari Luar KBB */
                <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-2">
                  <div className="text-[11px] text-amber-900 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> Sekolah Asal Berada di Luar Kab. Bandung Barat
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Sekolah Asal *</label>
                      <input
                        type="text"
                        value={data.school_origin_name}
                        onChange={(e) => setData('school_origin_name', e.target.value)}
                        placeholder="Contoh: SMPN 3 Bandung / SDN Menteng"
                        className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-800 bg-white border border-amber-200 focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Kota / Kab & Provinsi Asal *</label>
                      <input
                        type="text"
                        value={data.origin_city}
                        onChange={(e) => setData('origin_city', e.target.value)}
                        placeholder="Contoh: Kota Bandung, Jawa Barat"
                        className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-800 bg-white border border-amber-200 focus:border-amber-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">NPSN Asal (Opsional)</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={data.school_origin_npsn}
                        onChange={(e) => setData('school_origin_npsn', e.target.value)}
                        placeholder="NPSN jika ada"
                        className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-800 bg-white border border-amber-200 focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">Alasan Mutasi</label>
            <textarea
              rows={2}
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
              placeholder="Contoh: Pindah domisili orang tua bekerja di Kabupaten Bandung Barat"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
            ></textarea>
          </div>
        </div>

        {/* 3. Unggah Dokumen Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">3</span>
              Unggah Dokumen Persyaratan
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
