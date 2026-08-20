import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import { Lock, Mail, ArrowRight, ShieldCheck, School } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head title="Login SIMUTASI PETADIK" />

      {/* Decorative Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 p-8 text-white text-center relative">
          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner border border-white/20">
            <span className="text-2xl font-extrabold tracking-wider text-white">PETADIK</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">SIMUTASI KBB</h2>
          <p className="text-xs text-sky-100 mt-1 font-medium">
            Sistem Informasi Mutasi Peserta Didik Dinas Pendidikan Kabupaten Bandung Barat
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Alamat Email / Account
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="nama@disdik.kbb.go.id"
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
              Pilih Akun Pengujian Demo
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreset('admin@disdik.kbb.go.id')}
                className="p-2.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  Admin Dinas
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">admin@disdik.kbb.go.id</p>
              </button>

              <button
                type="button"
                onClick={() => setPreset('operator@sdn1bandungbarat.sch.id')}
                className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-all"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                  <School className="w-3.5 h-3.5 text-emerald-600" />
                  Op. Sekolah
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5 truncate">operator@sdn1...sch.id</p>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
