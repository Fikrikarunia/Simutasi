import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertCircle,
  FilePlus,
  BookOpen
} from 'lucide-react';

export default function HelpModal({ userRole = 'operator_sekolah' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('flow'); // 'flow' | 'docs' | 'faq' | 'contact'
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin';

  const faqItems = [
    {
      q: 'Berapa lama estimasi waktu proses verifikasi pengajuan mutasi?',
      a: 'Proses verifikasi dokumen oleh Admin Dinas Pendidikan KBB biasanya membutuhkan waktu 1-2 hari kerja sejak pengajuan diajukan oleh Operator Sekolah.',
    },
    {
      q: 'Apa yang harus dilakukan jika status pengajuan "Dikembalikan"?',
      a: 'Operator Sekolah wajib melihat catatan revisi dari Dinas pada detail pengajuan, memperbarui/mengunggah ulang dokumen yang belum valid, lalu mengklik tombol "Kirim Ulang Dokumen".',
    },
    {
      q: 'Bagaimana cara memverifikasi keaslian Surat Rekomendasi Mutasi Digital?',
      a: 'Surat rekomendasi dilengkapi dengan QR Code Legalitas. Siapapun dapat memindai QR Code tersebut atau memasukkan nomor registrasi pada menu Cek Legalitas di halaman depan (Landing Page).',
    },
    {
      q: 'Format dan batas ukuran dokumen yang diperbolehkan?',
      a: 'Dokumen berkas (Surat Pindah, Rapor, KK) harus berformat PDF, JPG, JPEG, atau PNG dengan ukuran maksimal 2MB per berkas.',
    },
    {
      q: 'Apakah bisa mengajukan mutasi jika NISN siswa belum aktif/berbeda?',
      a: 'NISN siswa harus valid 10 digit. Jika terjadi perbedaan data NISN, pastikan data siswa sudah disinkronkan dengan Dapodik Kemendikbud terlebih dahulu.',
    },
  ];

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100/80 rounded-full transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        title="Pusat Bantuan & Panduan"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-500/30">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black tracking-tight">Pusat Bantuan & Panduan SIMUTASI</h2>
                  <p className="text-xs text-sky-300 font-medium">
                    {isAdmin ? 'Panduan Penggunaan Admin Dinas Pendidikan KBB' : 'Panduan Penggunaan Operator Sekolah'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs font-semibold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('flow')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'flow'
                    ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Clock className="w-4 h-4" />
                Alur Mutasi
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('docs')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'docs'
                    ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <FileText className="w-4 h-4" />
                Syarat Berkas
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faq')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'faq'
                    ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Tanya Jawab (FAQ)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'contact'
                    ? 'bg-sky-600 text-white font-bold shadow-sm shadow-sky-200'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Phone className="w-4 h-4" />
                Kontak Helpdesk
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1 text-slate-700 text-xs leading-relaxed space-y-6">
              {/* TAB 1: ALUR MUTASI */}
              {activeTab === 'flow' && (
                <div className="space-y-6">
                  <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-extrabold text-sm text-sky-900">
                        {isAdmin ? 'Alur Kerja Verifikasi Admin Dinas' : 'Alur Pengajuan Mutasi Siswa (Operator Sekolah)'}
                      </h3>
                      <p className="text-sky-700 text-xs mt-0.5">
                        Prosedur resmi mutasi siswa masuk & keluar di Kabupaten Bandung Barat.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {isAdmin ? 'Menerima Berkas Masuk' : 'Pengisian Form & Upload Dokumen'}
                        </h4>
                        <p className="text-slate-600 mt-1">
                          {isAdmin
                            ? 'Admin Dinas menerima pengajuan yang masuk di menu Dashboard dengan status "Diajukan". Dokumen dapat langsung diperiksa.'
                            : 'Operator Sekolah menginput NISN, data siswa, sekolah asal/tujuan, serta mengunggah 3 berkas utama (Surat Pindah, Rapor, KK).'}
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {isAdmin ? 'Verifikasi & Validasi Dokumen' : 'Proses Pemantauan & Verifikasi Dinas'}
                        </h4>
                        <p className="text-slate-600 mt-1">
                          {isAdmin
                            ? 'Pilih "Setujui" jika seluruh berkas sesuai, atau "Kembalikan" jika ada berkas yang kurang/buram disertai catatan revisi.'
                            : 'Pengajuan ditinjau oleh Admin Dinas. Operator dapat memantau indikator status di dashboard.'}
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-black flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {isAdmin ? 'Penerbitan Surat Digital' : 'Revisi (Jika Ada) / Menunggu Surat'}
                        </h4>
                        <p className="text-slate-600 mt-1">
                          {isAdmin
                            ? 'Untuk pengajuan ber-status "Diverifikasi", klik "Terbitkan Surat Digital" untuk secara otomatis meng-generate Surat Mutasi ber-QR Code.'
                            : 'Jika status "Dikembalikan", perbarui dokumen sesuai catatan revisi. Jika "Diverifikasi", tunggu penerbitan surat resmi.'}
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">
                          {isAdmin ? 'Arsip & Cetak Legalisir' : 'Unduh Surat Mutasi Resmi'}
                        </h4>
                        <p className="text-slate-600 mt-1">
                          {isAdmin
                            ? 'Surat tersimpan dalam arsip digital dan dapat diverifikasi keasliannya sewaktu-waktu melalui sistem QR Code.'
                            : 'Setelah status ber-ubah "Selesai", tombol "Unduh Surat" aktif. Cetak surat untuk diserahkan ke orang tua / sekolah.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SYARAT DOKUMEN */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-900">Checklist Berkas Persyaratan Mutasi Siswa</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        1
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">Surat Keterangan Pindah</h4>
                      <p className="text-[11px] text-slate-500">
                        Diterbitkan oleh sekolah asal dan diketahui oleh Kepala Sekolah ber-stempel basah.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        2
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">Fotokopi Rapor</h4>
                      <p className="text-[11px] text-slate-500">
                        Halaman identitas siswa & halaman nilai semester terakhir yang sudah dilegalisir.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        3
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">Kartu Keluarga (KK)</h4>
                      <p className="text-[11px] text-slate-500">
                        Scan / foto Kartu Keluarga terbaru yang menampilkan nama siswa bersangkutan.
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1 mt-4">
                    <h4 className="font-extrabold text-xs text-amber-900 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      Ketentuan Spesifikasi Upload File:
                    </h4>
                    <ul className="list-disc list-inside text-[11px] text-amber-800 space-y-0.5 font-medium pl-1">
                      <li>Format yang diterima: <strong>PDF, JPG, JPEG, PNG</strong>.</li>
                      <li>Ukuran berkas maksimal: <strong>2 MB per file</strong>.</li>
                      <li>Pastikan tulisan pada dokumen terbaca dengan jelas (tidak buram/terpotong).</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  {/* FAQ Search */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari kata kunci masalah atau pertanyaan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                    />
                  </div>

                  {/* FAQ Accordion List */}
                  <div className="space-y-2">
                    {filteredFaqs.length === 0 ? (
                      <p className="text-center py-6 text-slate-400 font-medium">
                        Tidak ada pertanyaan yang sesuai dengan pencarian Anda.
                      </p>
                    ) : (
                      filteredFaqs.map((faq, idx) => {
                        const isOpenFaq = openFaqIndex === idx;
                        return (
                          <div
                            key={idx}
                            className="border border-slate-200 rounded-2xl overflow-hidden bg-white transition-all"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIndex(isOpenFaq ? null : idx)}
                              className="w-full p-4 text-left font-bold text-xs text-slate-900 hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer"
                            >
                              <span>{faq.q}</span>
                              {isOpenFaq ? (
                                <ChevronUp className="w-4 h-4 text-sky-600 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                            </button>
                            {isOpenFaq && (
                              <div className="px-4 pb-4 text-slate-600 text-xs border-t border-slate-100 bg-slate-50/50 pt-3">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: KONTAK HELPDESK */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
                    <h3 className="font-black text-base">Layanan Bantuan & Helpdesk KBB</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Tim Dukungan Teknis Mutasi Dinas Pendidikan Kabupaten Bandung Barat siap membantu Anda jika mengalami kendala sistem.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <a
                        href="https://wa.me/6281234567890?text=Halo%20Helpdesk%20SIMUTASI%20Disdik%20KBB,%20saya%20membutuhkan%20bantuan."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Chat WhatsApp Helpdesk
                      </a>
                      <a
                        href="mailto:disdik@bandungbaratkab.go.id"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-all border border-slate-700 cursor-pointer"
                      >
                        <Mail className="w-4 h-4" />
                        Kirim Email Support
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                        <MapPin className="w-4 h-4 text-sky-600" />
                        Alamat Kantor Dinas
                      </div>
                      <p className="text-slate-600 text-[11px] leading-normal">
                        Komplek Perkantoran Pemkab Bandung Barat, Jl. Raya Ngamprah No. 1, Kabupaten Bandung Barat, Jawa Barat 40552.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs">
                        <Clock className="w-4 h-4 text-sky-600" />
                        Jam Operasional Layanan
                      </div>
                      <p className="text-slate-600 text-[11px] leading-normal">
                        Senin - Jumat: 08.00 - 16.00 WIB
                        <br />
                        Sabtu, Minggu & Hari Libur Nasional: Tutup
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>SIMUTASI v2.0 &bull; Disdik Kabupaten Bandung Barat</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
