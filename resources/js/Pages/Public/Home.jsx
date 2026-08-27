import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
  Search, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  School, 
  UserCheck, 
  Clock, 
  X, 
  HelpCircle, 
  Download, 
  AlertCircle,
  FileCheck,
  Building2,
  ChevronRight,
  ArrowRightLeft
} from 'lucide-react';

export default function PublicHome() {
  const { auth } = usePage().props;
  const user = auth?.user;

  // Active Navigation Section Tracker (ScrollSpy)
  const [activeSection, setActiveSection] = useState('layanan-mutasi');

  // Cek Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // ScrollSpy Listener
  useEffect(() => {
    const sections = ['layanan-mutasi', 'tata-cara', 'syarat-mutasi', 'faq'];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // offset header height

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setErrorMessage('');
    setSearchResult(null);

    try {
      const response = await fetch('/api/check-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      if (data.found) {
        setSearchResult(data.application);
      } else {
        setErrorMessage(data.message || 'Pengajuan mutasi tidak ditemukan.');
      }
    } catch (err) {
      setErrorMessage('Terjadi kesalahan saat memeriksa status pengajuan.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      <Head title="SIMUTASI KBB - Sistem Informasi Mutasi Peserta Didik Kab. Bandung Barat" />

      {/* 1. Top Announcement Bar */}
      <div className="bg-[#0b438e] text-white px-4 py-2 text-xs font-medium flex items-center justify-center gap-3 border-b border-blue-900">
        <span className="px-2 py-0.5 bg-sky-400 text-blue-950 rounded font-black text-[10px] uppercase tracking-wider">
          SIMUTASI INFO
        </span>
        <p className="text-center truncate">
          Layanan pengajuan Mutasi Peserta Didik (Masuk & Keluar) Kabupaten Bandung Barat kini 100% Online & Bebas Biaya.
        </p>
      </div>

      {/* 2. Main Navigation Header (Dynamic ScrollSpy Nav Pill Bar) */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-6 lg:px-16 py-3.5 flex items-center justify-between shadow-xs">
        {/* Brand Logo SIMUTASI */}
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

        {/* Dynamic Center Menu Links (Pill moves dynamically on click & scroll) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80 text-xs font-bold text-slate-600 shadow-inner">
          <button
            onClick={() => scrollToSection('layanan-mutasi')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSection === 'layanan-mutasi'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Layanan Mutasi
          </button>
          <button
            onClick={() => scrollToSection('tata-cara')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSection === 'tata-cara'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Tata Cara
          </button>
          <button
            onClick={() => scrollToSection('syarat-mutasi')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSection === 'syarat-mutasi'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            Persyaratan
          </button>
          <button
            onClick={() => scrollToSection('faq')}
            className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              activeSection === 'faq'
                ? 'bg-white text-sky-700 shadow-sm shadow-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            FAQ
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 bg-slate-100/80 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs border border-slate-200/80 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-sky-600" />
            Cek Status
          </button>

          <Link
            href={route('login')}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/30 flex items-center gap-1.5 transition-all"
          >
            Masuk ➔
          </Link>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative pt-16 pb-24 px-6 lg:px-16 bg-gradient-to-b from-cyan-50/60 via-sky-50/40 to-white overflow-hidden text-center">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-sky-300/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Platform Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200/80 shadow-xs text-sky-800 text-xs font-bold">
            <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">✦</span>
            Layanan Resmi Mutasi Siswa — Disdik Kab. Bandung Barat
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15]">
            Pengurusan Mutasi Siswa <br className="hidden sm:inline" />
            <span className="italic font-normal bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
              Cepat, Transparan & Digital
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            SIMUTASI memfasilitasi permohonan mutasi peserta didik (Mutasi Masuk & Mutasi Keluar) antara sekolah dengan Dinas Pendidikan Kabupaten Bandung Barat. Pengajuan daring, verifikasi real-time, dan penerbitan Surat Rekomendasi Mutasi Digital ber-QR Code resmi.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href={route('login')}
              className="px-7 py-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-sky-600/30 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-white" />
              Ajukan Mutasi Sekarang
            </Link>

            <button
              onClick={() => scrollToSection('tata-cara')}
              className="px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-sm border border-slate-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              Pelajari Tata Cara ➔
            </button>
          </div>
        </div>
      </section>

      {/* 4. Layanan Mutasi Utama Section */}
      <section id="layanan-mutasi" className="py-20 px-6 lg:px-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Layanan SIMUTASI
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-3 tracking-tight">
              2 Jenis Layanan Mutasi Peserta Didik
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Sistem memproses permohonan mutasi masuk maupun mutasi keluar secara terintegrasi online.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Mutasi Masuk */}
            <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-8 rounded-3xl border border-sky-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-sky-600/30">
                📥
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mutasi Masuk Kabupaten Bandung Barat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Layanan permohonan mutasi bagi peserta didik yang pindah dari sekolah di luar Kabupaten Bandung Barat (atau antar sekolah dalam KBB) menuju sekolah tujuan di Kabupaten Bandung Barat.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pengajuan formulir daring oleh Operator Sekolah Tujuan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Upload berkas Rapor, Surat Pindah, dan KK
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verifikasi & Penerbitan Surat Rekomendasi Digital Ber-QR
                </li>
              </ul>
            </div>

            {/* Card 2: Mutasi Keluar */}
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/50 p-8 rounded-3xl border border-amber-100 shadow-sm space-y-4 relative overflow-hidden group hover:border-amber-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-amber-500/30">
                📤
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mutasi Keluar Kabupaten Bandung Barat</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Layanan permohonan mutasi bagi peserta didik yang pindah dari sekolah di lingkungan Kabupaten Bandung Barat menuju sekolah tujuan di luar daerah atau provinsi lain.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-semibold pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pengajuan daring oleh Operator Sekolah Asal KBB
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fitur pengembalian berkas jika memerlukan perbaikan
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Surat Izin Mutasi Keluar Digital siap diunduh PDF
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tata Cara Kerja SIMUTASI Section */}
      <section id="tata-cara" className="py-20 px-6 lg:px-16 bg-slate-50 border-t border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-white px-3 py-1 rounded-full border border-slate-200">
              Tata Cara Pengajuan
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-3 tracking-tight">
              5 Alur Kerja Sistem SIMUTASI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Proses administrasi mutasi terstruktur dari awal hingga pengunduhan Surat Rekomendasi Digital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">1</span>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Login Operator</h4>
              <p className="text-[11px] text-slate-500">Operator sekolah masuk ke portal SIMUTASI menggunakan akun resmi.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">2</span>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Input & Upload Berkas</h4>
              <p className="text-[11px] text-slate-500">Mengisi data NISN siswa dan melampirkan file Surat Pindah, Rapor, & KK.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">3</span>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Verifikasi Dinas</h4>
              <p className="text-[11px] text-slate-500">Tim Verifikator Dinas Pendidikan memeriksa kelengkapan & keabsahan berkas.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-3">4</span>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Persetujuan / Revisi</h4>
              <p className="text-[11px] text-slate-500">Jika berkas kurang, dikembalikan dengan catatan. Jika lengkap, disetujui.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mb-3">5</span>
              <h4 className="font-bold text-xs text-slate-900 mb-1">Terbit Surat Digital</h4>
              <p className="text-[11px] text-slate-500">Surat Rekomendasi Mutasi terbit otomatis dengan QR Code verifikasi sah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Syarat & Persyaratan Mutasi Section */}
      <section id="syarat-mutasi" className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Dokumen Persyaratan
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mt-3 tracking-tight">
              Persyaratan Berkas Pengajuan Mutasi
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Format dokumen: PDF, JPG, atau PNG. Ukuran file maksimal 2MB.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Syarat Mutasi Masuk */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-600" />
                Persyaratan Mutasi Masuk KBB
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span><strong>Surat Keterangan Pindah:</strong> Resmi dari sekolah/kabupaten asal.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>Fotokopi Rapor Legalisir:</strong> Halaman Biodata & Nilai Semester Terakhir.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>Kartu Keluarga (KK):</strong> Scan/fotokopi KK siswa yang mengajukan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span><strong>Surat Permohonan Orang Tua:</strong> Permohonan pindah sekolah dari orang tua/wali.</span>
                </li>
              </ul>
            </div>

            {/* Syarat Mutasi Keluar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-500" />
                Persyaratan Mutasi Keluar KBB
              </h3>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                  <span><strong>Surat Rekomendasi Pindah:</strong> Diterbitkan dari Kepala Sekolah Asal KBB.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                  <span><strong>Surat Keterangan Diterima:</strong> Dari sekolah tujuan (jika sudah ada).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                  <span><strong>Fotokopi Rapor Legalisir:</strong> Seluruh halaman nilai valid.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">4</span>
                  <span><strong>Kartu Keluarga (KK):</strong> Sebagai dokumen pendukung domisili siswa.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section id="faq" className="py-20 px-6 lg:px-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Pertanyaan Sering Diajukan (FAQ SIMUTASI)
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Siapa yang mengajukan permohonan mutasi di SIMUTASI?</h4>
              <p className="text-slate-600 leading-relaxed">
                Pengajuan mutasi dilakukan oleh Operator Sekolah asal atau Operator Sekolah tujuan menggunakan akun resmi terdaftar pada aplikasi SIMUTASI.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Berapa lama verifikasi dokumen oleh Admin Dinas Pendidikan?</h4>
              <p className="text-slate-600 leading-relaxed">
                Proses pemeriksaan dokumen oleh verifikator Dinas Pendidikan Kabupaten Bandung Barat membutuhkan waktu 1 - 3 hari kerja sejak berkas dikirim.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 mb-1">Bagaimana memverifikasi keabsahan Surat Rekomendasi Mutasi Digital?</h4>
              <p className="text-slate-600 leading-relaxed">
                Setiap Surat Rekomendasi Mutasi dilengkapi QR Code sah. Siapapun dapat memindai QR Code tersebut untuk langsung membuka halaman verifikasi keabsahan surat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 lg:px-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-base">
                SM
              </div>
              <h3 className="font-serif font-bold text-lg text-white">SIMUTASI KBB</h3>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Dinas Pendidikan Kabupaten Bandung Barat<br />
              Kompleks Perkantoran Pemkab Bandung Barat, Jl. Raya Padalarang - Cisarua Km. 2.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3">Navigasi Utama</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => scrollToSection('layanan-mutasi')} className="hover:text-white">Layanan Mutasi</button></li>
              <li><button onClick={() => scrollToSection('tata-cara')} className="hover:text-white">Tata Cara</button></li>
              <li><button onClick={() => scrollToSection('syarat-mutasi')} className="hover:text-white">Persyaratan</button></li>
              <li><Link href={route('login')} className="hover:text-white">Login Operator / Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-3">Hubungi Kami</h4>
            <p className="text-slate-400 leading-relaxed">
              Pos-el: disdik@bandungbaratkab.go.id<br />
              Laman Resmi: www.disdikkbb.org<br />
              Telepon/Fax: (022) 27010112
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © {new Date().getFullYear()} SIMUTASI - Dinas Pendidikan Kabupaten Bandung Barat. All rights reserved.
        </div>
      </footer>

      {/* 8. Cek Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-base">Cek Status Pengajuan Mutasi</h3>
              </div>
              <button
                onClick={() => { setShowStatusModal(false); setSearchResult(null); setErrorMessage(''); }}
                className="p-1 text-slate-400 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5">
              <form onSubmit={handleCheckStatus} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Masukkan Nomor Registrasi atau NISN Siswa
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Contoh: REG-2023-001 atau 0123456789"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                  >
                    {loading ? 'Mencari...' : 'Cari'}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Search Result Display */}
              {searchResult && (
                <div className="p-5 bg-sky-50/60 border border-sky-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-sky-200/60">
                    <span className="font-bold text-slate-900">{searchResult.registration_number}</span>
                    <span className="px-2.5 py-1 bg-sky-600 text-white font-bold rounded-lg text-[10px]">
                      {searchResult.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-700">
                    <p><strong>Nama Siswa:</strong> {searchResult.student_name} (NISN: {searchResult.nisn})</p>
                    <p><strong>Jenis Mutasi:</strong> Mutasi {searchResult.type}</p>
                    <p><strong>Sekolah Asal:</strong> {searchResult.school_origin}</p>
                    <p><strong>Sekolah Tujuan:</strong> {searchResult.school_destination}</p>
                    {searchResult.submitted_at && <p><strong>Tanggal Pengajuan:</strong> {searchResult.submitted_at}</p>}
                  </div>

                  {searchResult.rejection_note && (
                    <div className="p-3 bg-amber-100/70 border border-amber-300 rounded-xl text-amber-900 text-[11px]">
                      <strong>Catatan Revisi:</strong> {searchResult.rejection_note}
                    </div>
                  )}

                  {searchResult.has_letter && searchResult.download_url && (
                    <a
                      href={searchResult.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                    >
                      <Download className="w-4 h-4" /> Unduh Surat Digital (PDF)
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
