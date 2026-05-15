"use client";

import { useState, useEffect } from 'react';
import { useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/(auth)/actions';
import {
  LayoutDashboard,
  PackagePlus,
  ArrowLeftRight,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { format } from 'date-fns';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/tambah-resi', label: 'Tambah Resi', icon: PackagePlus, end: false },
  { to: '/cek-resi', label: 'Check', icon: ArrowLeftRight, end: false },
  { to: '/daftar-resi', label: 'Daftar Resi', icon: ClipboardList, end: false },
];

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/tambah-resi': 'Tambah Resi',
  '/cek-resi': 'Check Resi',
  '/daftar-resi': 'Daftar Resi',
  '/profile': 'Profile',
  '/settings': 'Settings',
};

export default function Sidebar({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();

  // Derive display values from Supabase JWT claims
  const displayName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? 'User';
  const displayEmail = user?.email ?? '';
  const initials = displayName.charAt(0).toUpperCase();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  const pageTitle = pageTitles[pathname] || 'Rekap Resi';

  // Close mobile on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center px-5 h-16 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
        >
          <Image src="/icon.svg" alt="Rekap Resi" width={22} height={22} />
        </div>
        {sidebarOpen && (
          <div className="ml-3 overflow-hidden whitespace-nowrap">
            <span className="text-white font-semibold tracking-wide" style={{ fontSize: '1rem' }}>Rekap Resi</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3">
        {!sidebarOpen && <div className="h-4" />}
        {sidebarOpen && (
          <p className="text-xs uppercase tracking-widest px-3 mb-3" style={{ color: 'rgba(148,163,184,0.6)' }}>
            Menu
          </p>
        )}
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
            const isActive = end ? pathname === to : pathname?.startsWith(to) && (pathname === to || pathname[to.length] === '/');
            return (
              <li key={to}>
                <Link
                  href={to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  } ${sidebarOpen ? {} : 'w-min'}`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', boxShadow: '0 0 15px rgba(59,130,246,0.4)' }
                      : {}
                  }
                >
                  {!isActive && (
                    <span
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {sidebarOpen && (
                    <span className="whitespace-nowrap overflow-hidden" style={{ fontSize: '0.9rem' }}>{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>


      </nav>

      {/* Bottom user info */}
      <div
        className="px-3 py-4 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all hover:bg-white/5 ${!sidebarOpen ? 'justify-center' : ''}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', fontSize: '0.8rem' }}
          >
            {user?.initials ?? initials}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white whitespace-nowrap overflow-hidden" style={{ fontSize: '0.85rem' }}>{displayName}</p>
              <p className="text-slate-400 whitespace-nowrap overflow-hidden" style={{ fontSize: '0.72rem' }}>{displayEmail}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] dark:bg-background">
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col shrink-0 transition-all duration-300 relative"
        style={{
          width: sidebarOpen ? '260px' : '72px',
          background: 'linear-gradient(180deg, #0F1629 0%, #0D1B3E 100%)',
        }}
      >
        {renderSidebarContent()}
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
          aria-expanded={sidebarOpen}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' }}
        >
          {sidebarOpen ? <ChevronLeft size={12} className="text-white" /> : <ChevronRight size={12} className="text-white" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ background: 'linear-gradient(180deg, #0F1629 0%, #0D1B3E 100%)' }}
          >
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white">
                <span className="sr-only">Tutup menu</span>
                <X size={20} />
              </button>
            </div>
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header
          className="h-16 flex items-center px-6 gap-4 shrink-0 border-b border-slate-200 bg-white dark:border-border dark:bg-card"
        >
          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-slate-500 hover:text-slate-900 transition-colors dark:text-muted-foreground dark:hover:text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={22} />
          </button>

          {/* Page Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-slate-800 truncate dark:text-foreground" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{pageTitle}</h1>
            <p className="text-slate-400 hidden sm:block dark:text-muted-foreground" style={{ fontSize: '0.75rem' }}>
              {format(new Date(), 'EEEE, dd MMMM yyyy')}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(prev => !prev)}
                aria-label="Buka menu profil"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-all hover:bg-slate-100 dark:hover:bg-muted/50"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', fontSize: '0.8rem' }}
                >
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-slate-700 dark:text-foreground" style={{ fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.2 }}>{displayName}</p>
                  <p className="text-slate-400 dark:text-muted-foreground" style={{ fontSize: '0.7rem', lineHeight: 1.2 }}>User</p>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block dark:text-muted-foreground" />
              </button>
              {profileOpen && (
                <div
                  className="absolute right-0 top-12 w-52 rounded-2xl overflow-hidden z-50 bg-white dark:bg-popover"
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-border">
                    <p className="text-slate-800 font-semibold dark:text-popover-foreground" style={{ fontSize: '0.85rem' }}>{displayName}</p>
                    <p className="text-slate-400 dark:text-muted-foreground" style={{ fontSize: '0.72rem' }}>{displayEmail}</p>
                  </div>
                  {[
                    { icon: User, label: 'Profil Saya', href: '/profile' },
                    { icon: Settings, label: 'Pengaturan', href: '/settings' },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors dark:text-muted-foreground dark:hover:bg-muted/50"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <Icon size={15} />
                      {label}
                    </Link>
                  ))}
                  <div className="border-t border-slate-100 dark:border-border">
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-60 dark:hover:bg-red-950/40"
                      style={{ color: '#EF4444', fontSize: '0.85rem' }}
                    >
                      <LogOut size={15} />
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F1F5F9] dark:bg-background">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
