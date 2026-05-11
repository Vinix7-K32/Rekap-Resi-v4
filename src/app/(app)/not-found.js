import Link from 'next/link';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <PackageX size={28} className="text-slate-400" />
      </div>

      <div className="space-y-2">
        <h2 className="text-[1.1rem] font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
        <p className="max-w-sm text-[0.875rem] text-slate-500">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
      </div>

      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-[0.875rem] font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}
