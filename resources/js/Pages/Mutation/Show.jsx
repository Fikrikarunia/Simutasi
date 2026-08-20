import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  FileText, 
  Download, 
  ZoomIn, 
  Send, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  Printer 
} from 'lucide-react';

export default function MutationShow({ application, userRole }) {
  const [selectedDoc, setSelectedDoc] = useState(application.documents?.[0] || null);
  const [rejectionNote, setRejectionNote] = useState(application.rejection_note || '');
  const [docValids, setDocValids] = useState(() => {
    const map = {};
    application.documents?.forEach((doc) => {
      map[doc.id] = { is_valid: doc.is_valid !== false, notes: doc.notes || '' };
    });
    return map;
  });

  const isAdmin = userRole === 'admin_dinas' || userRole === 'super_admin';

  const handleDocStatusChange = (docId, isValid) => {
    setDocValids((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], is_valid: isValid },
    }));
  };

  const handleVerifySubmit = (action) => {
    router.post(route('mutation.verify', application.id), {
      action,
      rejection_note: rejectionNote,
      documents: docValids,
    });
  };

  const handleIssueLetter = () => {
    if (confirm('Terbitkan Surat Rekomendasi Mutasi Digital untuk siswa ini?')) {
      router.post(route('mutation.issue_letter', application.id));
    }
  };

  return (
    <AuthenticatedLayout title="Verifikasi Berkas Mutasi">
      <Head title={`Verifikasi #${application.registration_number} - SIMUTASI`} />

      {/* Top Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href={route('dashboard')} className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            Verifikasi Berkas Mutasi
            <span className="text-xs px-3 py-1 bg-sky-100 text-sky-800 rounded-full font-bold border border-sky-200">
              Status: {application.status}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Tinjau kesesuaian dokumen untuk permohonan mutasi {application.type}.</p>
        </div>

        {/* Action button if letter ready */}
        {application.status === 'Selesai' && application.letter && (
          <a
            href={route('mutation.download_letter', application.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
          >
            <Download className="w-4 h-4" />
            Unduh Surat Digital (PDF)
          </a>
        )}
      </div>

      {/* Rejection Note Warning if status is Dikembalikan */}
      {application.status === 'Dikembalikan' && application.rejection_note && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs">
          <h4 className="font-bold flex items-center gap-2 mb-1 text-amber-800">
            <RotateCcw className="w-4 h-4" /> Catatan Perbaikan dari Admin Dinas:
          </h4>
          <p className="ml-6 font-medium">{application.rejection_note}</p>
        </div>
      )}

      {/* Main Grid: Left Details & Checklist, Right Previewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Data Siswa Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Data Siswa</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Nama Lengkap</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{application.student?.name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">NISN</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{application.student?.nisn}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Sekolah Asal</p>
                <p className="font-semibold text-slate-800 mt-0.5">{application.school_origin_name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Tingkat / Kelas</p>
                <p className="font-semibold text-slate-800 mt-0.5">{application.destination_class}</p>
              </div>
              <div className="col-span-2">
                <p className="text-slate-400 font-medium">Sekolah Tujuan</p>
                <p className="font-semibold text-slate-800 mt-0.5">{application.school_destination_name}</p>
              </div>
            </div>
          </div>

          {/* Ceklis Verifikasi Dokumen Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ceklis Verifikasi Dokumen</h2>

            <div className="space-y-3">
              {application.documents?.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    selectedDoc?.id === doc.id ? 'border-sky-500 bg-sky-50/40 ring-2 ring-sky-200' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-900">{doc.document_label}</h3>
                      <p className="text-[11px] text-slate-400">
                        {doc.original_name} • {(doc.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>

                  {/* Verification Radio Buttons for Admin */}
                  {isAdmin && application.status === 'Diajukan' ? (
                    <div className="flex items-center gap-4 text-xs font-bold shrink-0">
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                        <input
                          type="radio"
                          name={`valid_${doc.id}`}
                          checked={docValids[doc.id]?.is_valid === true}
                          onChange={() => handleDocStatusChange(doc.id, true)}
                          className="text-sky-600"
                        />
                        Sesuai
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                        <input
                          type="radio"
                          name={`valid_${doc.id}`}
                          checked={docValids[doc.id]?.is_valid === false}
                          onChange={() => handleDocStatusChange(doc.id, false)}
                          className="text-rose-600"
                        />
                        Tidak Sesuai
                      </label>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">
                      {doc.is_valid === true ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Sesuai
                        </span>
                      ) : doc.is_valid === false ? (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Tidak Sesuai
                        </span>
                      ) : (
                        <span className="text-slate-400">Belum diverifikasi</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Admin Catatan Perbaikan Textarea */}
            {isAdmin && application.status === 'Diajukan' && (
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Perbaikan</label>
                <textarea
                  rows={3}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  placeholder="Isi catatan jika ada dokumen yang tidak sesuai atau perlu direvisi..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:border-sky-600 focus:outline-none"
                ></textarea>

                {/* Verification Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleVerifySubmit('revisi')}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-rose-50 text-rose-700 border border-slate-200 hover:border-rose-300 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Kembalikan (Revisi)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifySubmit('setujui')}
                    className="px-5 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Setujui & Proses
                  </button>
                </div>
              </div>
            )}

            {/* Issue Letter Button for Admin when Diverifikasi */}
            {isAdmin && (application.status === 'Diverifikasi' || application.status === 'Surat Diproses') && (
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleIssueLetter}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  Terbitkan Surat Mutasi Digital (PDF & QR)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Document Previewer Pane (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-full flex flex-col min-h-[500px]">
            {/* Toolbar */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 truncate max-w-[200px]">
                Pratinjau: {selectedDoc ? selectedDoc.document_label : 'Dokumen'}
              </span>
              <div className="flex items-center gap-2 text-slate-500">
                <ZoomIn className="w-4 h-4 cursor-pointer hover:text-slate-800" />
                <Download className="w-4 h-4 cursor-pointer hover:text-slate-800" />
              </div>
            </div>

            {/* Preview Viewport */}
            <div className="p-6 bg-slate-200/50 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-sm bg-white rounded-xl shadow-lg border border-slate-200 p-6 space-y-4">
                <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-xl mx-auto flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{selectedDoc?.document_label || 'Dokumen Persyaratan'}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedDoc?.original_name || 'dokumen.pdf'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 text-left border border-slate-100 space-y-1">
                  <p><strong>Status Validasi:</strong> {selectedDoc?.is_valid === true ? '✅ Sesuai' : selectedDoc?.is_valid === false ? '❌ Tidak Sesuai' : '⏳ Belum Diverifikasi'}</p>
                  <p><strong>Ukuran File:</strong> {selectedDoc ? (selectedDoc.file_size / 1024 / 1024).toFixed(2) : 0} MB</p>
                </div>
                <span className="inline-block px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg font-bold text-xs border border-sky-200 cursor-pointer">
                  Validasi Dokumen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Tracking Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600" />
          Tracking Timeline Pengajuan (Audit Trail)
        </h3>

        <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {application.audit_trails?.map((log, idx) => (
            <div key={log.id} className="flex gap-4 items-start relative z-10">
              <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-white shadow-xs">
                ✓
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{log.action}</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {new Date(log.created_at).toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-slate-600">{log.description}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">Oleh: {log.user?.name || 'Sistem'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
