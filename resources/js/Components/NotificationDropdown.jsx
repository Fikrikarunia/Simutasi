import React, { useState, useEffect, useRef } from 'react';
import { Link, router } from '@inertiajs/react';
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  Clock, 
  ExternalLink,
  X
} from 'lucide-react';

export default function NotificationDropdown({ notifications = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('simutasi_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);

  // Persist read IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('simutasi_read_notifications', JSON.stringify(readIds));
    } catch (e) {
      // ignore
    }
  }, [readIds]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const items = notifications.map((notif) => ({
    ...notif,
    isRead: readIds.includes(notif.id),
  }));

  const unreadCount = items.filter((item) => !item.isRead).length;

  const filteredItems = activeTab === 'unread' 
    ? items.filter((item) => !item.isRead) 
    : items;

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(allIds);
  };

  const handleItemClick = (item) => {
    markAsRead(item.id);
    setIsOpen(false);
    if (item.url) {
      router.visit(item.url);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-sky-600" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-rose-50 border-rose-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      case 'success':
        return 'bg-emerald-50 border-emerald-100';
      case 'info':
      default:
        return 'bg-sky-50 border-sky-100';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100/80 rounded-full relative transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20"
        title="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="min-w-[18px] h-4 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-slate-900">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-100 text-sky-700 rounded-full">
                  {unreadCount} baru
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-sky-600 hover:text-sky-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Tandai dibaca
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Semua ({items.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'unread'
                  ? 'bg-slate-900 text-white font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-700">Tidak ada notifikasi</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {activeTab === 'unread'
                    ? 'Semua notifikasi telah dibaca.'
                    : 'Belum ada aktivitas terkini.'}
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-all cursor-pointer relative group ${
                    !item.isRead ? 'bg-sky-50/30 font-medium' : ''
                  }`}
                >
                  {/* Unread indicator dot */}
                  {!item.isRead && (
                    <span className="w-2 h-2 rounded-full bg-sky-600 absolute top-4 left-2 shrink-0"></span>
                  )}

                  {/* Icon */}
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${getBgColor(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <h4 className={`text-xs ${!item.isRead ? 'font-black text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                      {item.time}
                    </span>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-600 transition-colors shrink-0 mt-1" />
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Link
              href={route('mutation.index')}
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
            >
              Lihat Semua Pengajuan ➔
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
