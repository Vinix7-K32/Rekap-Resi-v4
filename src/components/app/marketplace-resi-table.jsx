import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO } from 'date-fns';
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

const STATUS_STYLES = {
  Menunggu: {
    pill: 'bg-blue-500/10 text-blue-700',
    dot: 'bg-blue-500',
  },
  Diterima: {
    pill: 'bg-green-500/10 text-green-700',
    dot: 'bg-green-500',
  },
  Selesai: {
    pill: 'bg-slate-500/10 text-slate-600',
    dot: 'bg-slate-500',
  },
};

function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Menunggu;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${
        styles.pill
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}

function formatTanggal(value) {
  if (!value) return '-';
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, 'dd MMM yyyy');
}

export default function MarketplaceResiTable({
  search,
  onSearchChange,
  onSearchClear,
  showFilters,
  onToggleFilters,
  statusFilter,
  marketplaceFilter,
  onStatusFilterChange,
  onMarketplaceFilterChange,
  hasFilters,
  onResetFilters,
  paginated,
  page,
  pageSize,
  totalPages,
  pageSizes,
  onPageChange,
  onPageSizeChange,
  filteredCount,
  totalCount,
  deleteConfirmId,
  onDeleteRequest,
  onDeleteCancel,
  onDeleteConfirm,
  statuses,
  marketplaces,
  loading,
  errorMessage,
}) {
  const activeFilterCount = [statusFilter, marketplaceFilter].filter(Boolean).length;

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-3 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="text-[1.2rem] font-bold text-slate-800">Daftar Resi Marketplace</h2>
          <p className="mt-1 text-[0.85rem] text-slate-500">
            Data dari hasil input marketplace di menu cek resi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[0.85rem] text-slate-600">
            <span className="text-slate-400">Total: </span>
            <span className="font-semibold text-slate-700">{filteredCount}</span>
            {filteredCount !== totalCount && (
              <span className="text-slate-400"> dari {totalCount}</span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cari nomor resi..."
              className={`w-full rounded-xl border px-4 py-2.5 pl-10 text-[0.85rem] text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-100 ${
                search ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-slate-50'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={onSearchClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleFilters}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[0.85rem] transition-all ${
              showFilters
                ? 'border-blue-200 bg-blue-50 text-blue-600 font-semibold'
                : 'border-slate-200 bg-white text-slate-500'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filter
            {hasFilters && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[0.65rem] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {hasFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-[0.85rem] text-slate-500 transition-all hover:bg-red-50 hover:text-red-500"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          )}
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[0.75rem] text-slate-500">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(event) => onStatusFilterChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[0.85rem] text-slate-700 outline-none"
                  >
                    <option value="">Semua Status</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-[0.75rem] text-slate-500">Marketplace</label>
                  <select
                    value={marketplaceFilter}
                    onChange={(event) => onMarketplaceFilterChange(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[0.85rem] text-slate-700 outline-none"
                  >
                    <option value="">Semua Marketplace</option>
                    {marketplaces.map((marketplace) => (
                      <option key={marketplace} value={marketplace}>
                        {marketplace}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="w-10 px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">#</th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">
                  Nomor Resi
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">
                  Marketplace
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">
                  Status
                </th>
                <th className="whitespace-nowrap px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">
                  Tanggal Input
                </th>
                <th className="px-5 py-3.5 text-left text-[0.75rem] font-medium text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex flex-col items-center gap-3 text-slate-500">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-500" />
                        <p className="text-[0.85rem]">Memuat data marketplace...</p>
                      </div>
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <p className="text-[0.85rem] text-red-500">{errorMessage}</p>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                          <Package size={28} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-[0.9rem] font-semibold text-slate-600">Tidak ada data</p>
                          <p className="mt-1 text-[0.85rem] text-slate-400">
                            {hasFilters ? 'Coba ubah filter pencarian' : 'Belum ada resi marketplace'}
                          </p>
                        </div>
                        {hasFilters && (
                          <button
                            type="button"
                            onClick={onResetFilters}
                            className="flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-[0.85rem] text-blue-600 transition-all hover:bg-blue-50"
                          >
                            <RefreshCw size={14} />
                            Reset Filter
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((resi, index) => (
                    <motion.tr
                      key={resi.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="group border-b border-slate-50 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-3.5 text-[0.78rem] text-slate-400">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[0.85rem] font-medium text-slate-700">
                          {resi.nomor_resi}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.78rem] font-medium text-slate-600">
                          {resi.marketplace}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={resi.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[0.85rem] text-slate-500">
                        {formatTanggal(resi.created_at)}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => onDeleteRequest(resi.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredCount > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="text-[0.8rem] text-slate-400">Tampilkan</span>
              <select
                value={pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[0.8rem] text-slate-700 outline-none"
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-[0.8rem] text-slate-400">dari {filteredCount} data</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-all disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter((pageNumber) =>
                    pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - page) <= 1
                  )
                  .reduce((acc, pageNumber, index, arr) => {
                    if (index > 0 && pageNumber - arr[index - 1] > 1) acc.push('...');
                    acc.push(pageNumber);
                    return acc;
                  }, [])
                  .map((pageItem, index) =>
                    pageItem === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-8 w-8 items-center justify-center text-[0.8rem] text-slate-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageItem}
                        type="button"
                        onClick={() => onPageChange(pageItem)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[0.8rem] transition-all ${
                          page === pageItem
                            ? 'border-blue-600 bg-blue-600 font-semibold text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        {pageItem}
                      </button>
                    )
                  )}
              </div>

              <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-all disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {deleteConfirmId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="mb-2 text-center text-[1rem] font-bold text-slate-800">
                Hapus Resi Marketplace?
              </h3>
              <p className="mb-6 text-center text-[0.85rem] text-slate-500">
                Data ini akan dihapus secara permanen dan tidak bisa dikembalikan.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onDeleteCancel}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-[0.9rem] text-slate-600 transition-all hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={onDeleteConfirm}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-[0.9rem] text-white shadow-[0_4px_15px_rgba(220,38,38,0.3)] transition-all"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
