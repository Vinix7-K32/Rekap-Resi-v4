'use client';

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Package2, Store } from 'lucide-react';
import { toast } from 'sonner';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DaftarResiTable from '@/components/app/daftar-resi-table';
import MarketplaceResiTable from '@/components/app/marketplace-resi-table';
import { deleteResi, getResiList } from '@/services/resi';
import { deleteMarketplaceResi, getMarketplaceResiList } from '@/services/marketplace-resi';
import { useDebounce } from '@/hooks/use-debounce';

const PAGE_SIZES = [10, 20, 50];
const STATUSES = ['Menunggu', 'Diterima', 'Selesai'];
const MARKETPLACES = ['Shopee', 'Tokopedia', 'Lazada', 'Bukalapak', 'TikTok Shop'];
const COLUMNS = [
  { key: 'nomor_resi', label: 'Nomor Resi', sortable: true },
  { key: 'marketplace', label: 'Marketplace', sortable: true },
  { key: 'kurir', label: 'Kurir', sortable: true },
  { key: 'tanggal', label: 'Tanggal', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

// ─── Skeleton fallback untuk Suspense ────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded-xl bg-slate-200" />
      <div className="h-4 w-72 rounded-lg bg-slate-100" />
      <div className="h-10 w-64 rounded-xl bg-slate-200" />
      <div className="h-96 w-full rounded-2xl bg-slate-100" />
    </div>
  );
}

// ─── Konten utama (butuh useSearchParams → wajib dalam Suspense) ─────────────
function DaftarResiContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // ── Baca state dari URL ──────────────────────────────────────────────────
  const activeTab = searchParams.get('tab') ?? 'internal';

  // Filter Resi Internal (dari URL)
  const urlSearch = searchParams.get('q') ?? '';
  const statusFilter = searchParams.get('status') ?? '';
  const marketplaceFilter = searchParams.get('mp') ?? '';
  const dateFrom = searchParams.get('dari') ?? '';
  const dateTo = searchParams.get('sampai') ?? '';

  // Filter Resi Marketplace (dari URL)
  const urlMpSearch = searchParams.get('mpq') ?? '';
  const marketplaceStatusFilter = searchParams.get('mpstatus') ?? '';
  const marketplaceMarketplaceFilter = searchParams.get('mpmp') ?? '';

  // ── Local state untuk input search (debounced sebelum ke URL) ───────────
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [mpSearchInput, setMpSearchInput] = useState(urlMpSearch);

  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedMpSearch = useDebounce(mpSearchInput, 300);

  // ── State UI murni (tidak perlu di URL) ─────────────────────────────────
  const [resiList, setResiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState('tanggal');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [marketplaceResiList, setMarketplaceResiList] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [marketplaceError, setMarketplaceError] = useState('');
  const [showMarketplaceFilters, setShowMarketplaceFilters] = useState(false);
  const [marketplacePage, setMarketplacePage] = useState(1);
  const [marketplacePageSize, setMarketplacePageSize] = useState(PAGE_SIZES[0]);
  const [marketplaceDeleteConfirm, setMarketplaceDeleteConfirm] = useState(null);

  // ── Helper: commit update ke URL tanpa reload ────────────────────────────
  const updateParams = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // ── Sync debounced search → URL ──────────────────────────────────────────
  useEffect(() => {
    updateParams({ q: debouncedSearch });
    setPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    updateParams({ mpq: debouncedMpSearch });
    setMarketplacePage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMpSearch]);

  // ── Fetch data ───────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;

    const loadResi = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const { data, error } = await getResiList();
        if (!active) return;
        if (error) {
          setErrorMessage('Gagal memuat data resi.');
          setResiList([]);
          toast.error('Gagal memuat resi', { description: error.message });
        } else {
          setResiList(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!active) return;
        setErrorMessage('Terjadi kesalahan saat memuat data.');
        setResiList([]);
        toast.error('Terjadi kesalahan tak terduga');
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadMarketplaceResi = async () => {
      setMarketplaceLoading(true);
      setMarketplaceError('');
      try {
        const { data, error } = await getMarketplaceResiList();
        if (!active) return;
        if (error) {
          setMarketplaceError('Gagal memuat data marketplace.');
          setMarketplaceResiList([]);
          toast.error('Gagal memuat resi marketplace', { description: error.message });
        } else {
          setMarketplaceResiList(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!active) return;
        setMarketplaceError('Terjadi kesalahan saat memuat data marketplace.');
        setMarketplaceResiList([]);
        toast.error('Terjadi kesalahan tak terduga');
      } finally {
        if (active) setMarketplaceLoading(false);
      }
    };

    loadResi();
    loadMarketplaceResi();
    return () => { active = false; };
  }, []);

  // ── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  // ── Filter & paginate Resi Internal ─────────────────────────────────────
  const filtered = useMemo(() => {
    const q = urlSearch.trim().toLowerCase();
    return resiList
      .filter((resi) => {
        if (q) {
          const nomor = resi.nomor_resi?.toLowerCase() ?? '';
          const nama = resi.nama_penerima?.toLowerCase() ?? '';
          if (!nomor.includes(q) && !nama.includes(q)) return false;
        }
        if (statusFilter && resi.status !== statusFilter) return false;
        if (marketplaceFilter && resi.marketplace !== marketplaceFilter) return false;
        if (dateFrom && resi.tanggal < dateFrom) return false;
        if (dateTo && resi.tanggal > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        const va = `${a[sortKey] ?? ''}`;
        const vb = `${b[sortKey] ?? ''}`;
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [resiList, urlSearch, statusFilter, marketplaceFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = Boolean(urlSearch || statusFilter || marketplaceFilter || dateFrom || dateTo);

  // ── Filter & paginate Resi Marketplace ──────────────────────────────────
  const filteredMarketplace = useMemo(() => {
    const q = urlMpSearch.trim().toLowerCase();
    return marketplaceResiList
      .filter((resi) => {
        if (q && !(resi.nomor_resi?.toLowerCase() ?? '').includes(q)) return false;
        if (marketplaceStatusFilter && resi.status !== marketplaceStatusFilter) return false;
        if (marketplaceMarketplaceFilter && resi.marketplace !== marketplaceMarketplaceFilter)
          return false;
        return true;
      })
      .sort((a, b) => {
        const va = `${a.created_at ?? ''}`;
        const vb = `${b.created_at ?? ''}`;
        return vb.localeCompare(va);
      });
  }, [marketplaceResiList, urlMpSearch, marketplaceStatusFilter, marketplaceMarketplaceFilter]);

  const marketplaceTotalPages = Math.max(
    1,
    Math.ceil(filteredMarketplace.length / marketplacePageSize)
  );
  const marketplacePaginated = filteredMarketplace.slice(
    (marketplacePage - 1) * marketplacePageSize,
    marketplacePage * marketplacePageSize
  );
  const hasMarketplaceFilters = Boolean(
    urlMpSearch || marketplaceStatusFilter || marketplaceMarketplaceFilter
  );

  // ── Reset handlers ───────────────────────────────────────────────────────
  const resetFilters = () => {
    setSearchInput('');
    const params = new URLSearchParams(searchParams);
    ['q', 'status', 'mp', 'dari', 'sampai'].forEach((k) => params.delete(k));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setPage(1);
  };

  const resetMarketplaceFilters = () => {
    setMpSearchInput('');
    const params = new URLSearchParams(searchParams);
    ['mpq', 'mpstatus', 'mpmp'].forEach((k) => params.delete(k));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setMarketplacePage(1);
  };

  // ── Delete handlers ──────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      const { error } = await deleteResi(deleteConfirm);
      if (error) {
        toast.error('Gagal menghapus resi', { description: error.message });
        return;
      }
      setResiList((cur) => cur.filter((item) => item.id !== deleteConfirm));
      toast.success('Resi berhasil dihapus');
    } catch {
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleMarketplaceDeleteConfirm = async () => {
    if (!marketplaceDeleteConfirm) return;
    try {
      const { error } = await deleteMarketplaceResi(marketplaceDeleteConfirm);
      if (error) {
        toast.error('Gagal menghapus resi marketplace', { description: error.message });
        return;
      }
      setMarketplaceResiList((cur) => cur.filter((item) => item.id !== marketplaceDeleteConfirm));
      toast.success('Resi marketplace berhasil dihapus');
    } catch {
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setMarketplaceDeleteConfirm(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-[1.4rem] font-bold text-slate-800">Daftar Resi</h1>
          <p className="mt-1 text-[0.9rem] text-slate-500">
            Kelola seluruh nomor resi pengembalian
          </p>
        </div>

        {/* Badge total per tab */}
        <div className="flex items-center gap-2 text-[0.85rem] text-slate-600">
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5">
            <span className="text-slate-400">Internal: </span>
            <span className="font-semibold text-slate-700">
              {filtered.length}
            </span>
            {filtered.length !== resiList.length && (
              <span className="text-slate-400"> / {resiList.length}</span>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-3 py-1.5">
            <span className="text-slate-400">Marketplace: </span>
            <span className="font-semibold text-slate-700">
              {filteredMarketplace.length}
            </span>
            {filteredMarketplace.length !== marketplaceResiList.length && (
              <span className="text-slate-400"> / {marketplaceResiList.length}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Tabs
          value={activeTab}
          onValueChange={(value) => updateParams({ tab: value === 'internal' ? '' : value })}
          className="space-y-5"
        >
          <TabsList className="h-10 rounded-xl px-1">
            <TabsTrigger value="internal" className="flex items-center gap-2 px-4 text-[0.85rem]">
              <Package2 size={15} />
              Resi Internal
              {hasFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[0.6rem] font-bold text-white">
                  ●
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2 px-4 text-[0.85rem]">
              <Store size={15} />
              Resi Marketplace
              {hasMarketplaceFilters && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[0.6rem] font-bold text-white">
                  ●
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Tab: Resi Internal */}
          <TabsContent value="internal">
            <DaftarResiTable
              search={searchInput}
              onSearchChange={(value) => { setSearchInput(value); }}
              onSearchClear={() => { setSearchInput(''); }}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters((prev) => !prev)}
              statusFilter={statusFilter}
              marketplaceFilter={marketplaceFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onStatusFilterChange={(value) => { updateParams({ status: value }); setPage(1); }}
              onMarketplaceFilterChange={(value) => { updateParams({ mp: value }); setPage(1); }}
              onDateFromChange={(value) => { updateParams({ dari: value }); setPage(1); }}
              onDateToChange={(value) => { updateParams({ sampai: value }); setPage(1); }}
              hasFilters={hasFilters}
              onResetFilters={resetFilters}
              columns={COLUMNS}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              paginated={paginated}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              pageSizes={PAGE_SIZES}
              onPageChange={setPage}
              onPageSizeChange={(value) => { setPageSize(value); setPage(1); }}
              filteredCount={filtered.length}
              totalCount={resiList.length}
              deleteConfirmId={deleteConfirm}
              onDeleteRequest={setDeleteConfirm}
              onDeleteCancel={() => setDeleteConfirm(null)}
              onDeleteConfirm={handleDeleteConfirm}
              statuses={STATUSES}
              marketplaces={MARKETPLACES}
              loading={loading}
              errorMessage={errorMessage}
            />
          </TabsContent>

          {/* Tab: Resi Marketplace */}
          <TabsContent value="marketplace">
            <MarketplaceResiTable
              search={mpSearchInput}
              onSearchChange={(value) => { setMpSearchInput(value); }}
              onSearchClear={() => { setMpSearchInput(''); }}
              showFilters={showMarketplaceFilters}
              onToggleFilters={() => setShowMarketplaceFilters((prev) => !prev)}
              statusFilter={marketplaceStatusFilter}
              marketplaceFilter={marketplaceMarketplaceFilter}
              onStatusFilterChange={(value) => { updateParams({ mpstatus: value }); setMarketplacePage(1); }}
              onMarketplaceFilterChange={(value) => { updateParams({ mpmp: value }); setMarketplacePage(1); }}
              hasFilters={hasMarketplaceFilters}
              onResetFilters={resetMarketplaceFilters}
              paginated={marketplacePaginated}
              page={marketplacePage}
              pageSize={marketplacePageSize}
              totalPages={marketplaceTotalPages}
              pageSizes={PAGE_SIZES}
              onPageChange={setMarketplacePage}
              onPageSizeChange={(value) => { setMarketplacePageSize(value); setMarketplacePage(1); }}
              filteredCount={filteredMarketplace.length}
              totalCount={marketplaceResiList.length}
              deleteConfirmId={marketplaceDeleteConfirm}
              onDeleteRequest={setMarketplaceDeleteConfirm}
              onDeleteCancel={() => setMarketplaceDeleteConfirm(null)}
              onDeleteConfirm={handleMarketplaceDeleteConfirm}
              statuses={STATUSES}
              marketplaces={MARKETPLACES}
              loading={marketplaceLoading}
              errorMessage={marketplaceError}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// ─── Export page ─────────────────────────────────────────────────────────────
export default function DaftarResiPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DaftarResiContent />
    </Suspense>
  );
}
