import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message = 'Apakah Anda yakin ingin melanjutkan tindakan ini?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'info',
  processing = false,
}) {
  if (!isOpen) return null;

  const typeConfig = {
    info: {
      bgIcon: 'bg-sky-100 text-sky-700',
      icon: <Info className="w-6 h-6" />,
      btn: 'bg-sky-700 hover:bg-sky-800 text-white shadow-sky-600/30',
    },
    success: {
      bgIcon: 'bg-emerald-100 text-emerald-700',
      icon: <CheckCircle2 className="w-6 h-6" />,
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
    },
    warning: {
      bgIcon: 'bg-amber-100 text-amber-800',
      icon: <AlertTriangle className="w-6 h-6" />,
      btn: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30',
    },
    danger: {
      bgIcon: 'bg-rose-100 text-rose-700',
      icon: <ShieldAlert className="w-6 h-6" />,
      btn: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30',
    },
  };

  const currentType = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 relative space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={processing}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${currentType.bgIcon}`}>
            {currentType.icon}
          </div>
          <div className="space-y-1 pr-4">
            <h3 className="font-extrabold text-base text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 ${currentType.btn}`}
          >
            {processing ? 'Memproses...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
