'use client';

import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import {
  Package,
  PackageCheck,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const KPI_CONFIG = [
  {
    label: 'Total Resi',
    key: 'totalResi',
    icon: Package,
    trend: '+12%',
    border: 'border-blue-200',
    iconBg: 'bg-blue-50',
    iconText: 'text-blue-500',
    progress: 'bg-blue-500',
    progressBg: 'bg-blue-50',
  },
  {
    label: 'Resi Hari Ini',
    key: 'todayCount',
    icon: PackageCheck,
    trend: '+5%',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-500',
    progress: 'bg-emerald-500',
    progressBg: 'bg-emerald-50',
  },
  {
    label: 'Resi 7 Hari Terakhir',
    key: 'weekCount',
    icon: RefreshCw,
    trend: '+8%',
    border: 'border-amber-200',
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-500',
    progress: 'bg-amber-500',
    progressBg: 'bg-amber-50',
  },
  {
    label: 'Resi Bulan Ini',
    key: 'monthCount',
    icon: CalendarDays,
    trend: '+18%',
    border: 'border-violet-200',
    iconBg: 'bg-violet-50',
    iconText: 'text-violet-500',
    progress: 'bg-violet-500',
    progressBg: 'bg-violet-50',
  },
];

const STATUS_STYLES = {
  Menunggu: {
    pill: 'bg-blue-500/10 text-blue-700',
    dot: 'bg-blue-500',
  },
  Diterima: {
    pill: 'bg-emerald-500/10 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  Selesai: {
    pill: 'bg-slate-500/10 text-slate-600',
    dot: 'bg-slate-500',
  },
};

const MARKETPLACE_COLORS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-red-500',
  'bg-violet-500',
];

function StatusBadge({ status, size = 'md' }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Menunggu;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[0.72rem]' : 'px-2.5 py-1 text-[0.78rem]';

  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full font-semibold', sizeClass, styles.pill)}>
      <span className={cn('rounded-full', size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2', styles.dot)} />
      {status}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
        <p className="mb-1 text-[0.75rem] text-slate-500">{label}</p>
        <p className="text-[1rem] font-semibold text-slate-800">
          {payload[0].value}{' '}
          <span className="text-[0.75rem] font-normal text-slate-400">resi</span>
        </p>
      </div>
    );
  }
  return null;
}

function formatTanggal(value) {
  if (!value) return '-';
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, 'dd MMM yyyy');
}

export default function DashboardUI({
  kpiValues,
  totalResi,
  chartData,
  marketplaceDist,
  recentResi,
  onCreateResi,
  onViewAll,
  loading,
  errorMessage,
}) {
  const safeTotal = Math.max(totalResi, 1);

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.85rem] text-red-600">
          {errorMessage}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-[1.5rem] font-bold text-slate-800">Selamat Datang 👋</h1>
          <p className="mt-1 text-[0.9rem] text-slate-500">
            {format(new Date(), 'EEEE, dd MMMM yyyy')} - Berikut ringkasan aktivitas resi Anda
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onCreateResi}
          className="flex items-center gap-2 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-[0.9rem] text-white shadow-[0_4px_15px_rgba(59,130,246,0.35)]"
        >
          <Package size={16} />
          Tambah Resi Baru
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CONFIG.map((cfg, index) => {
          const value = kpiValues?.[cfg.key] ?? 0;
          const progressWidth = Math.min(100, (value / safeTotal) * 100);

          return (
            <motion.div
              key={cfg.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={cn(
                'rounded-2xl border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]',
                cfg.border
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.82rem] text-slate-500">{cfg.label}</p>
                  <p className="mt-2 text-[2rem] font-bold leading-tight text-slate-800">{value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <ArrowUpRight size={14} className="text-emerald-500" />
                    <span className="text-[0.78rem] text-emerald-600">{cfg.trend}</span>
                    <span className="text-[0.78rem] text-slate-400">vs bulan lalu</span>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-2xl border',
                    cfg.iconBg,
                    cfg.border
                  )}
                >
                  <cfg.icon size={22} className={cfg.iconText} />
                </div>
              </div>
              <div className={cn('mt-4 h-1 rounded-full', cfg.progressBg)}>
                <div
                  className={cn('h-1 rounded-full opacity-70', cfg.progress)}
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)] lg:col-span-2"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-[1rem] font-semibold text-slate-800">Tren Resi 14 Hari Terakhir</h2>
              <p className="text-[0.78rem] text-slate-400">Jumlah resi masuk per hari</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" />
              <span className="text-[0.78rem] text-slate-500">Total: {totalResi} resi</span>
            </div>
          </div>
          <div className={loading ? 'opacity-60' : ''}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="resiCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#resiCount)"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, fill: '#3B82F6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]"
        >
          <h2 className="mb-1 text-[1rem] font-semibold text-slate-800">Per Marketplace</h2>
          <p className="mb-5 text-[0.78rem] text-slate-400">Distribusi resi berdasarkan platform</p>
          <div className="space-y-3.5">
            {marketplaceDist.map((mp, index) => {
              const pct = totalResi > 0 ? Math.round((mp.value / totalResi) * 100) : 0;

              return (
                <div key={mp.name}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[0.82rem] text-slate-600">{mp.name}</span>
                    <span className="text-[0.82rem] font-medium text-slate-700">{mp.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
                      className={cn('h-full rounded-full', MARKETPLACE_COLORS[index % MARKETPLACE_COLORS.length])}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-[1rem] font-semibold text-slate-800">Resi Terbaru</h2>
            <p className="text-[0.78rem] text-slate-400">10 resi terakhir yang ditambahkan</p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1.5 text-[0.82rem] text-blue-600 transition-colors hover:text-blue-700"
          >
            Lihat Semua
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {['Nomor Resi', 'Marketplace', 'Kurir', 'Tanggal', 'Status'].map((header) => (
                  <th
                    key={header}
                    className="border-b border-slate-100 px-6 py-3 text-left text-[0.78rem] font-medium text-slate-500"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentResi.map((resi) => (
                <tr
                  key={resi.id}
                  className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50"
                >
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-[0.85rem] font-medium text-slate-700">
                      {resi.nomor_resi}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.78rem] font-medium text-slate-600">
                      {resi.marketplace}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-[0.85rem] text-slate-500">{resi.kurir}</td>
                  <td className="px-6 py-3.5 text-[0.85rem] text-slate-500">
                    {formatTanggal(resi.tanggal)}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={resi.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
