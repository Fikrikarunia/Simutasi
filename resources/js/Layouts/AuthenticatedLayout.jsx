import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  FileText, 
  Clock, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  HelpCircle, 
  Building2, 
  ShieldCheck, 
  UserCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Info
} from 'lucide-react';

export default function AuthenticatedLayout({ children, title }) {
  const { auth, flash } = usePage().props;
  const user = auth.user;
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (flash?.success) {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type: 'success', title: 'Berhasil', message: flash.success }]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success]);

  useEffect(() => {
    if (flash?.error) {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type: 'error', title: 'Perhatian', message: flash.error }]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [flash?.error]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout'));
  };

  const isAdmin = user?.role === 'admin_dinas' || user?.role === 'super_admin';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800 font-sans relative">
      {/* Toast Notification Container (Floating Top-Right) */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-xs border-l-4 rounded-2xl p-4 shadow-xl border border-slate-200/80 flex items-start gap-3 transition-all animate-in slide-in-from-top-4 fade-in duration-300 ${
              toast.type === 'success' ? 'border-l-emerald-500' : 'border-l-rose-500'
            }`}
          >
            <div className={`p-1.5 rounded-xl shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="font-extrabold text-xs text-slate-900 leading-tight">{toast.title}</h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-sky-200">
              P
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">PETADIK</h1>
              <p className="text-[11px] font-semibold text-sky-600 mt-0.5">MUTASI SISWA KBB</p>
            </div>
          </div>

          {/* User Info Badge */}
          <div className="p-4 mx-3 my-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-300 text-sky-700 flex items-center justify-center font-bold shrink-0">
              {isAdmin ? <ShieldCheck className="w-5 h-5 text-sky-600" /> : <Building2 className="w-5 h-5 text-sky-600" />}
            </div>
            <div className="overflow-hidden">
              <h2 className="font-bold text-xs text-slate-900 truncate">
                {isAdmin ? 'Admin Dinas' : 'Operator Sekolah'}
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                {isAdmin ? 'Dinas Pendidikan Kab. Bandung Barat' : (user?.school?.name || 'SD Negeri Bandung Barat')}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            <Link
              href={route('dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                route().current('dashboard')
                  ? 'bg-sky-600 text-white font-semibold shadow-sm shadow-sky-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>

            <Link
              href={route('mutation.index', { type: 'masuk' })}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
              Mutasi Masuk
            </Link>

            <Link
              href={route('mutation.index', { type: 'keluar' })}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-500" />
              Mutasi Keluar
            </Link>

            <Link
              href={route('mutation.index')}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
            >
              <Clock className="w-4 h-4 text-indigo-500" />
              Riwayat
            </Link>
          </nav>
        </div>

        {/* Footer Nav */}
        <div className="p-3 border-t border-slate-100 space-y-1">
          <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-slate-500 hover:bg-slate-100 transition-all">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>

          <form onSubmit={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          {/* Global Search Bar */}
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari data siswa, NISN, atau sekolah..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-transparent rounded-full text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:outline-none transition-all"
            />
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-all">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 bg-rose-500 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="h-6 w-[1px] bg-slate-200"></div>

            {/* Profile Pill */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                {user?.name?.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
