import React, { useState } from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ShieldCheck, School, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: 'admin@disdik.kbb.go.id',
    password: 'password',
    remember: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  const setPreset = (email) => {
    setData('email', email);
    setData('password', 'password');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased">
      <Head title="Masuk SIMUTASI KBB - Disdik Kab. Bandung Barat" />

      {/* Top Announcement Bar */}
      <div className="bg-[#0b438e] text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-3 border-b border-blue-900 shrink-0">
        <span className="px-2 py-0.5 bg-sky-400 text-blue-950 rounded font-black text-[10px] uppercase tracking-wider">
          SIMUTASI INFO
        </span>
        <p className="text-center truncate">
          Layanan pengajuan Mutasi Peserta Didik (Masuk & Keluar) Kabupaten Bandung Barat kini 100% Online & Bebas Biaya.
        </p>
      </div>

      {/* Navigation Bar Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 lg:px-16 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 text-white flex items-center justify-center font-black text-lg shadow-md shadow-sky-600/25 group-hover:scale-105 transition-transform">
            SM
          </div>
          <div>
            <h1 className="font-serif font-black text-xl text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
              SIMUTASI KBB
            </h1>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Sistem Informasi Mutasi Peserta Didik</p>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-sky-600" />
          Halaman Utama
        </Link>
      </header>

      {/* Login Card Body */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-b from-sky-50/50 via-slate-50 to-white relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sky-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200/80">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 p-8 text-white text-center relative">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/20">
              <span className="text-2xl font-extrabold tracking-wider text-white">SM</span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">MASUK SIMUTASI KBB</h2>
            <p className="text-xs text-sky-100 mt-1 font-medium">
              Autentikasi Akses <strong>OPERATOR SEKOLAH</strong> & <strong>ADMIN DINAS PENDIDIKAN</strong>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Alamat Email Pengguna
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@disdik.kbb.go.id atau operator@sekolah.sch.id"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none transition-all"
                  required
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kata Sandi / Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none transition-all"
                  required
                />
              </div>
              {errors.password && <p className="text-xs text-rose-600 font-semibold mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                Ingat Saya
              </label>
              <span className="text-sky-600 font-bold hover:underline cursor-pointer">Lupa Password?</span>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {processing ? 'Memproses...' : 'Masuk ke Aplikasi'}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Presets */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-center text-[11px] font-bold uppercase text-slate-400 mb-2.5">
                Pilih Peran Penguji Demo (Preset)
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPreset('admin@disdik.kbb.go.id')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    data.email === 'admin@disdik.kbb.go.id'
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200'
                      : 'bg-slate-50 hover:bg-sky-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    ADMIN DINAS
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">admin@disdik.kbb.go.id</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPreset('operator@sdn1bandungbarat.sch.id')}
                  className={`p-2.5 rounded-xl text-left transition-all border cursor-pointer ${
                    data.email === 'operator@sdn1bandungbarat.sch.id'
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                      : 'bg-slate-50 hover:bg-emerald-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                    <School className="w-3.5 h-3.5 text-emerald-600" />
                    OPERATOR SEKOLAH
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">operator@sdn1...sch.id</p>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
