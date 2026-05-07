'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import DaftarResiTable from '@/components/app/daftar-resi-table';
import MarketplaceResiTable from '@/components/app/marketplace-resi-table';
import { deleteResi, getResiList } from '@/services/resi';
import {
  deleteMarketplaceResi,
  getMarketplaceResiList,
} from '@/services/marketplace-resi';

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

export default function DaftarResiPage() {
  const [resiList, setResiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [marketplaceFilter, setMarketplaceFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortKey, setSortKey] = useState('tanggal');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [marketplaceResiList, setMarketplaceResiList] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [marketplaceError, setMarketplaceError] = useState('');
  const [marketplaceSearch, setMarketplaceSearch] = useState('');
  const [marketplaceStatusFilter, setMarketplaceStatusFilter] = useState('');
  const [marketplaceMarketplaceFilter, setMarketplaceMarketplaceFilter] = useState('');
  const [marketplacePage, setMarketplacePage] = useState(1);
  const [marketplacePageSize, setMarketplacePageSize] = useState(PAGE_SIZES[0]);
  const [marketplaceDeleteConfirm, setMarketplaceDeleteConfirm] = useState(null);
  const [showMarketplaceFilters, setShowMarketplaceFilters] = useState(false);

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
      } catch (err) {
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
      } catch (err) {
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

    return () => {
      active = false;
    };
  }, []);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const filtered = useMemo(() => {
    const searchLower = search.trim().toLowerCase();
    return resiList
      .filter((resi) => {
        if (searchLower) {
          const nomorResi = resi.nomor_resi ? resi.nomor_resi.toLowerCase() : '';
          const namaPenerima = resi.nama_penerima ? resi.nama_penerima.toLowerCase() : '';

          if (!nomorResi.includes(searchLower) && !namaPenerima.includes(searchLower)) {
            return false;
          }
        }
        if (statusFilter && resi.status !== statusFilter) return false;
        if (marketplaceFilter && resi.marketplace !== marketplaceFilter) return false;
        if (dateFrom && resi.tanggal < dateFrom) return false;
        if (dateTo && resi.tanggal > dateTo) return false;
        return true;
      })
      .sort((a, b) => {
        const valueA = `${a[sortKey] ?? ''}`;
        const valueB = `${b[sortKey] ?? ''}`;
        return sortDir === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      });
  }, [resiList, search, statusFilter, marketplaceFilter, dateFrom, dateTo, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = Boolean(search || statusFilter || marketplaceFilter || dateFrom || dateTo);

  const filteredMarketplace = useMemo(() => {
    const searchLower = marketplaceSearch.trim().toLowerCase();
    return marketplaceResiList
      .filter((resi) => {
        if (searchLower) {
          const nomorResi = resi.nomor_resi ? resi.nomor_resi.toLowerCase() : '';
          if (!nomorResi.includes(searchLower)) return false;
        }
        if (marketplaceStatusFilter && resi.status !== marketplaceStatusFilter) return false;
        if (marketplaceMarketplaceFilter && resi.marketplace !== marketplaceMarketplaceFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const valueA = `${a.created_at ?? ''}`;
        const valueB = `${b.created_at ?? ''}`;
        return valueB.localeCompare(valueA);
      });
  }, [
    marketplaceResiList,
    marketplaceSearch,
    marketplaceStatusFilter,
    marketplaceMarketplaceFilter,
  ]);

  const marketplaceTotalPages = Math.max(
    1,
    Math.ceil(filteredMarketplace.length / marketplacePageSize)
  );
  const marketplacePaginated = filteredMarketplace.slice(
    (marketplacePage - 1) * marketplacePageSize,
    marketplacePage * marketplacePageSize
  );
  const hasMarketplaceFilters = Boolean(
    marketplaceSearch || marketplaceStatusFilter || marketplaceMarketplaceFilter
  );

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setMarketplaceFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const resetMarketplaceFilters = () => {
    setMarketplaceSearch('');
    setMarketplaceStatusFilter('');
    setMarketplaceMarketplaceFilter('');
    setMarketplacePage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;

    try {
      const { error } = await deleteResi(deleteConfirm);

      if (error) {
        toast.error('Gagal menghapus resi', { description: error.message });
        return;
      }

      setResiList((current) => current.filter((item) => item.id !== deleteConfirm));
      toast.success('Resi berhasil dihapus');
    } catch (err) {
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

      setMarketplaceResiList((current) =>
        current.filter((item) => item.id !== marketplaceDeleteConfirm)
      );
      toast.success('Resi marketplace berhasil dihapus');
    } catch (err) {
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setMarketplaceDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-10">
      <DaftarResiTable
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onSearchClear={() => {
          setSearch('');
          setPage(1);
        }}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        statusFilter={statusFilter}
        marketplaceFilter={marketplaceFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onMarketplaceFilterChange={(value) => {
          setMarketplaceFilter(value);
          setPage(1);
        }}
        onDateFromChange={(value) => {
          setDateFrom(value);
          setPage(1);
        }}
        onDateToChange={(value) => {
          setDateTo(value);
          setPage(1);
        }}
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
        onPageSizeChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
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

      <MarketplaceResiTable
        search={marketplaceSearch}
        onSearchChange={(value) => {
          setMarketplaceSearch(value);
          setMarketplacePage(1);
        }}
        onSearchClear={() => {
          setMarketplaceSearch('');
          setMarketplacePage(1);
        }}
        showFilters={showMarketplaceFilters}
        onToggleFilters={() => setShowMarketplaceFilters((prev) => !prev)}
        statusFilter={marketplaceStatusFilter}
        marketplaceFilter={marketplaceMarketplaceFilter}
        onStatusFilterChange={(value) => {
          setMarketplaceStatusFilter(value);
          setMarketplacePage(1);
        }}
        onMarketplaceFilterChange={(value) => {
          setMarketplaceMarketplaceFilter(value);
          setMarketplacePage(1);
        }}
        hasFilters={hasMarketplaceFilters}
        onResetFilters={resetMarketplaceFilters}
        paginated={marketplacePaginated}
        page={marketplacePage}
        pageSize={marketplacePageSize}
        totalPages={marketplaceTotalPages}
        pageSizes={PAGE_SIZES}
        onPageChange={setMarketplacePage}
        onPageSizeChange={(value) => {
          setMarketplacePageSize(value);
          setMarketplacePage(1);
        }}
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
    </div>
  );
}
