import React from 'react';
import { Head } from '@inertiajs/react';
import { ShieldCheck, CheckCircle2, Building2, Calendar, FileText } from 'lucide-react';

export default function VerifyLetter({ letter, application, student }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-800">
      <Head title="Verifikasi Keabsahan Surat - PETADIK KBB" />

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Verification Success Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-8 text-white text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg border border-white/30">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <span className="px-3 py-1 bg-emerald-500/40 text-emerald-100 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-400/40">
            Dokumen Resmi Terverifikasi
          </span>
          <h1 className="text-xl font-extrabold mt-2 tracking-tight">Dinas Pendidikan Kab. Bandung Barat</h1>
          <p className="text-xs text-emerald-100 mt-1">Sistem Layanan Mutasi Peserta Didik (SIMUTASI PETADIK)</p>
        </div>

        {/* Letter Details Card */}
        <div className="p-8 space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h2 className="font-bold text-xs text-emerald-950">Surat Rekomendasi Mutasi Valid & Asli</h2>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Surat ini diterbitkan secara digital melalui sistem resmi PETADIK Dinas Pendidikan Kabupaten Bandung Barat.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs divide-y divide-slate-100">
            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Nomor Surat</span>
              <span className="font-bold text-slate-900">{letter.letter_number}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Nama Siswa</span>
              <span className="font-bold text-slate-900">{student.name}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">NISN</span>
              <span className="font-bold text-slate-900">{student.nisn}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Jenis Mutasi</span>
              <span className="font-bold text-slate-900">Mutasi {application.type}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Sekolah Asal</span>
              <span className="font-semibold text-slate-800 text-right">{application.school_origin_name}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Sekolah Tujuan</span>
              <span className="font-semibold text-slate-800 text-right">{application.school_destination_name}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Tanggal Diterbitkan</span>
              <span className="font-bold text-slate-900">
                {new Date(letter.issued_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-slate-400 font-medium">Penandatangan</span>
              <span className="font-semibold text-slate-800 text-right">{letter.signed_by_name}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              © {new Date().getFullYear()} Dinas Pendidikan Kabupaten Bandung Barat. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
