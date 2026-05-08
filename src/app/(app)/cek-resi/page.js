'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { getResiList, updateResiStatus } from '@/services/resi';
import {
  addMarketplaceResi,
  deleteAllMarketplaceResi,
  deleteMarketplaceResi,
  getMarketplaceResiList,
} from '@/services/marketplace-resi';
import { CekResiUI } from '@/components/app/cek-resi-ui';
import { useActionState } from 'react';
import { addMarketplaceResiAction } from './actions';

export const MARKETPLACES = ['Shopee', 'Tokopedia', 'Lazada', 'Bukalapak', 'TikTok Shop'];

export const VERIFICATION_CONFIG = {
  cocok: {
    label: 'Cocok',
    tone: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    desc: 'Nomor resi dan marketplace sesuai dengan data internal',
  },
  tidak_cocok: {
    label: 'Tidak Cocok',
    tone: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    desc: 'Nomor resi ditemukan tetapi marketplace berbeda',
  },
  tidak_ditemukan: {
    label: 'Tidak Ditemukan',
    tone: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    desc: 'Nomor resi tidak ada dalam data resi internal',
  },
};

export default function CekResiPage() {
  const [resiList, setResiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [marketplaceData, setMarketplaceData] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [marketplaceError, setMarketplaceError] = useState('');
  const [inputTab, setInputTab] = useState('manual');
  const [manualNomor, setManualNomor] = useState('');
  const [manualMarketplace, setManualMarketplace] = useState('');
  const [manualError, setManualError] = useState('');
  
  const [formState, manualFormAction, isManualPending] = useActionState(addMarketplaceResiAction, {
    success: false,
    error: '',
    data: null,
    fieldErrors: {}
  });

  const [isDragging, setIsDragging] = useState(false);
  const [csvStatus, setCsvStatus] = useState('idle');
  const [csvError, setCsvError] = useState('');
  const [csvPreview, setCsvPreview] = useState([]);
  const fileInputRef = useRef(null);

  const [internalSearch, setInternalSearch] = useState('');
  const [internalMpFilter, setInternalMpFilter] = useState('all');

  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState('');
  const [comparisonResults, setComparisonResults] = useState(null);
  const [resultFilter, setResultFilter] = useState('all');

  useEffect(() => {
    let active = true;

    const loadResi = async () => {
      setLoading(true);
      setLoadError('');

      try {
        const { data, error } = await getResiList();

        if (!active) return;

        if (error) {
          setLoadError('Gagal memuat data resi.');
          setResiList([]);
          toast.error('Gagal memuat resi', { description: error.message });
        } else {
          setResiList(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!active) return;
        setLoadError('Terjadi kesalahan saat memuat data.');
        setResiList([]);
        toast.error('Terjadi kesalahan tak terduga');
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadMarketplace = async () => {
      setMarketplaceLoading(true);
      setMarketplaceError('');

      try {
        const { data, error } = await getMarketplaceResiList();

        if (!active) return;

        if (error) {
          setMarketplaceError('Gagal memuat data marketplace.');
          setMarketplaceData([]);
          toast.error('Gagal memuat data marketplace', { description: error.message });
        } else {
          setMarketplaceData(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!active) return;
        setMarketplaceError('Terjadi kesalahan saat memuat marketplace.');
        setMarketplaceData([]);
        toast.error('Terjadi kesalahan tak terduga');
      } finally {
        if (active) setMarketplaceLoading(false);
      }
    };

    loadResi();
    loadMarketplace();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (formState?.success && formState.data) {
      setTimeout(() => {
        setMarketplaceData((prev) => {
          if (prev.some((item) => item.id === formState.data.id)) return prev;
          return [formState.data, ...prev];
        });
        setManualNomor('');
        setComparisonResults(null);
        setManualError('');
      }, 0);
    } else if (formState?.error) {
      setTimeout(() => {
        setManualError(formState.error);
      }, 0);
      toast.error('Gagal menyimpan data marketplace', { description: formState.error });
    }
  }, [formState]);

  const refreshResiList = async () => {
    setLoading(true);
    setLoadError('');

    try {
      const { data, error } = await getResiList();

      if (error) {
        setLoadError('Gagal memuat data resi.');
        setResiList([]);
        toast.error('Gagal memuat resi', { description: error.message });
      } else {
        setResiList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setLoadError('Terjadi kesalahan saat memuat data.');
      setResiList([]);
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setLoading(false);
    }
  };

  const refreshMarketplaceList = async () => {
    setMarketplaceLoading(true);
    setMarketplaceError('');

    try {
      const { data, error } = await getMarketplaceResiList();

      if (error) {
        setMarketplaceError('Gagal memuat data marketplace.');
        setMarketplaceData([]);
        toast.error('Gagal memuat data marketplace', { description: error.message });
      } else {
        setMarketplaceData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setMarketplaceError('Terjadi kesalahan saat memuat marketplace.');
      setMarketplaceData([]);
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setMarketplaceLoading(false);
    }
  };

  const filteredInternal = useMemo(() => {
    const searchLower = internalSearch.trim().toLowerCase();
    return resiList.filter((resi) => {
      if (resi.status === 'Selesai') return false;
      const matchSearch = !searchLower || resi.nomor_resi?.toLowerCase().includes(searchLower);
      const matchMp = internalMpFilter === 'all' || resi.marketplace === internalMpFilter;
      return matchSearch && matchMp;
    });
  }, [resiList, internalSearch, internalMpFilter]);

  const eligibleInternal = useMemo(
    () => resiList.filter((resi) => resi.status !== 'Selesai'),
    [resiList]
  );

  const canCompare = marketplaceData.length > 0 && eligibleInternal.length > 0;

  const cocokCount = comparisonResults?.filter((item) => item.status === 'cocok').length ?? 0;
  const tidakCocokCount = comparisonResults?.filter((item) => item.status === 'tidak_cocok').length ?? 0;
  const tidakDitemukanCount = comparisonResults?.filter((item) => item.status === 'tidak_ditemukan').length ?? 0;
  const totalResult = comparisonResults?.length ?? 0;
  const matchRate = totalResult > 0 ? Math.round((cocokCount / totalResult) * 100) : 0;

  const filteredResults = useMemo(() => {
    if (!comparisonResults) return [];
    if (resultFilter === 'all') return comparisonResults;
    return comparisonResults.filter((item) => item.status === resultFilter);
  }, [comparisonResults, resultFilter]);


  const parseCSV = (content) => {
    const lines = content
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (!lines.length) return { entries: [], error: 'File CSV kosong' };

    const firstLower = lines[0].toLowerCase();
    const hasHeader =
      firstLower.includes('nomor') || firstLower.includes('resi') || firstLower.includes('marketplace');
    const dataLines = hasHeader ? lines.slice(1) : lines;

    if (!dataLines.length) return { entries: [], error: 'Tidak ada data setelah header' };

    const entries = [];
    dataLines.forEach((line, index) => {
      const cols = line
        .split(',')
        .map((col) => col.trim().replace(/^"|"$/g, ''));

      if (cols.length >= 2 && cols[0]) {
        entries.push({
          id: `csv-${Date.now()}-${index}`,
          nomor_resi: cols[0].toUpperCase(),
          marketplace: cols[1],
        });
      }
    });

    if (!entries.length) return { entries: [], error: 'Tidak ada baris data valid' };
    return { entries };
  };

  const processFile = useCallback(async (file) => {
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      setCsvStatus('error');
      setCsvError('Hanya file .CSV yang diizinkan');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setCsvStatus('error');
      setCsvError('Ukuran file maksimal 2MB');
      return;
    }

    setCsvStatus('loading');
    setCsvError('');

    await new Promise((resolve) => setTimeout(resolve, 700));

    try {
      const text = await file.text();
      const { entries, error } = parseCSV(text);

      if (!entries.length) {
        setCsvStatus('error');
        setCsvError(error ?? 'Gagal membaca data');
        return;
      }

      setCsvPreview(entries);
      setCsvStatus('success');
    } catch (err) {
      setCsvStatus('error');
      setCsvError('Gagal membaca file');
    }
  }, []);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = Array.from(event.dataTransfer.files).find((item) =>
      item.name.toLowerCase().endsWith('.csv')
    );
    if (file) processFile(file);
    else {
      setCsvStatus('error');
      setCsvError('Hanya file .CSV yang diizinkan');
    }
  };

  const handleImportCSV = async () => {
    const existing = new Set(marketplaceData.map((item) => item.nomor_resi?.toUpperCase()));
    const seen = new Set();
    const entries = [];

    csvPreview.forEach((item) => {
      const normalized = item.nomor_resi?.toUpperCase();
      if (!normalized) return;
      if (existing.has(normalized) || seen.has(normalized)) return;
      seen.add(normalized);
      entries.push({ nomor_resi: normalized, marketplace: item.marketplace });
    });

    if (entries.length === 0) {
      toast.error('Semua nomor resi sudah ada di daftar');
      return;
    }

    const results = await Promise.all(entries.map((entry) => addMarketplaceResi(entry)));
    const successEntries = results
      .filter((result) => !result.error)
      .map((result) => result.data)
      .filter(Boolean);
    const failedCount = results.filter((result) => result.error).length;

    if (failedCount > 0) {
      toast.error('Sebagian resi gagal disimpan', {
        description: `${failedCount} resi tidak tersimpan karena duplikasi atau error.`,
      });
    }

    if (successEntries.length > 0) {
      setMarketplaceData((prev) => [...successEntries, ...prev]);
      toast.success('Resi marketplace tersimpan', {
        description: `${successEntries.length} resi berhasil ditambahkan.`,
      });
    }

    setCsvPreview([]);
    setCsvStatus('idle');
    setComparisonResults(null);
  };

  const downloadTemplate = () => {
    const blob = new Blob(
      [
        'Nomor Resi,Marketplace\nJNE000000000001,Shopee\nJP000000000002,Tokopedia\nSPXID000000000003,Lazada',
      ],
      { type: 'text/csv' }
    );
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'template-marketplace.csv',
    });
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleCompare = async () => {
    if (!canCompare) {
      setCompareError('Data marketplace dan data internal harus tersedia');
      return;
    }

    setCompareError('');
    setIsComparing(true);

    await new Promise((resolve) => setTimeout(resolve, 900));

    const compareTargets = marketplaceData.filter(
      (mp) => (mp.status ?? 'Menunggu') === 'Menunggu'
    );

    const results = compareTargets.map((mp) => {
      const found = eligibleInternal.find(
        (resi) => resi.nomor_resi?.toLowerCase() === mp.nomor_resi.toLowerCase()
      );

      if (!found) {
        return {
          marketplace_id: mp.id,
          nomor_resi: mp.nomor_resi,
          marketplace_input: mp.marketplace,
          status: 'tidak_ditemukan',
        };
      }

      const mpMatch = found.marketplace?.toLowerCase() === mp.marketplace.toLowerCase();
      return {
        marketplace_id: mp.id,
        nomor_resi: mp.nomor_resi,
        marketplace_input: mp.marketplace,
        internal_resi: found,
        status: mpMatch ? 'cocok' : 'tidak_cocok',
      };
    });

    setComparisonResults(results);
    setResultFilter('all');

    const matched = results.filter(
      (item) => item.status === 'cocok' && item.internal_resi && item.marketplace_id
    );

    if (matched.length > 0) {
      const updateCandidates = matched.filter((item) => item.internal_resi.status !== 'Selesai');
      const updateResults = await Promise.all(
        updateCandidates.map((item) => updateResiStatus(item.internal_resi.id, 'Selesai'))
      );

      const updatedMarketplaceIds = new Set(
        updateCandidates
          .filter((_, index) => !updateResults[index]?.error)
          .map((item) => item.marketplace_id)
      );

      const deleteTargets = matched.filter(
        (item) => item.internal_resi.status === 'Selesai' || updatedMarketplaceIds.has(item.marketplace_id)
      );
      const deleteResults = await Promise.all(
        deleteTargets.map((item) => deleteMarketplaceResi(item.marketplace_id))
      );

      const updateFailures = updateResults.filter((result) => result?.error).length;
      const deleteFailures = deleteResults.filter((result) => result?.error).length;

      if (updateFailures > 0) {
        toast.error('Sebagian status resi gagal diperbarui', {
          description: `${updateFailures} resi belum diubah ke status selesai.`,
        });
      }

      if (deleteFailures > 0) {
        toast.error('Sebagian data marketplace gagal dihapus', {
          description: `${deleteFailures} data marketplace masih tersimpan.`,
        });
      }

      await Promise.all([refreshResiList(), refreshMarketplaceList()]);
    }

    setIsComparing(false);

    setTimeout(() => {
      document.getElementById('hasil-perbandingan')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 150);
  };

  const handleReset = async () => {
    try {
      const { error } = await deleteAllMarketplaceResi();

      if (error) {
        toast.error('Gagal menghapus data marketplace', { description: error.message });
      } else {
        await refreshMarketplaceList();
      }
    } catch (err) {
      toast.error('Terjadi kesalahan tak terduga');
    }

    setComparisonResults(null);
    setManualNomor('');
    setManualMarketplace('');
    setManualError('');
    setCsvStatus('idle');
    setCsvError('');
    setCsvPreview([]);
    setInternalSearch('');
    setInternalMpFilter('all');
    setCompareError('');
    setResultFilter('all');
    setIsComparing(false);
  };

  const handleClearMarketplace = async () => {
    try {
      const { error } = await deleteAllMarketplaceResi();

      if (error) {
        toast.error('Gagal menghapus data marketplace', { description: error.message });
        return;
      }

      await refreshMarketplaceList();
      setComparisonResults(null);
    } catch (err) {
      toast.error('Terjadi kesalahan tak terduga');
    }
  };

  const handleDeleteMarketplace = async (id) => {
    try {
      const { error } = await deleteMarketplaceResi(id);

      if (error) {
        toast.error('Gagal menghapus data marketplace', { description: error.message });
        return;
      }

      setMarketplaceData((prev) => prev.filter((item) => item.id !== id));
      setComparisonResults(null);
    } catch (err) {
      toast.error('Terjadi kesalahan tak terduga');
    }
  };

  const downloadResults = () => {
    if (!comparisonResults) return;

    const header = 'Nomor Resi,Marketplace Input,Kurir Internal,Status Resi,Status Verifikasi\n';
    const rows = comparisonResults.map((item) => {
      const label = VERIFICATION_CONFIG[item.status].label;
      return `${item.nomor_resi},${item.marketplace_input},${item.internal_resi?.kurir ?? '-'},${
        item.internal_resi?.status ?? '-'
      },${label}`;
    });

    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
    const link = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `verifikasi-resi-${format(new Date(), 'yyyy-MM-dd')}.csv`,
    });
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const steps = [
    {
      num: 1,
      label: 'Input Marketplace',
      done: marketplaceData.length > 0,
      sub: marketplaceData.length > 0 ? `${marketplaceData.length} resi` : 'Belum ada data',
    },
    {
      num: 2,
      label: 'Data Internal',
      done: resiList.length > 0,
      sub: `${resiList.length} resi tersimpan`,
    },
    {
      num: 3,
      label: 'Bandingkan',
      done: Boolean(comparisonResults),
      sub: comparisonResults ? 'Selesai' : 'Siap diproses',
    },
    {
      num: 4,
      label: 'Hasil',
      done: Boolean(comparisonResults),
      sub: comparisonResults ? `${totalResult} hasil` : 'Menunggu',
    },
  ];

  return <CekResiUI
    resiList={resiList} loading={loading} loadError={loadError}
    marketplaceData={marketplaceData} marketplaceLoading={marketplaceLoading} marketplaceError={marketplaceError}
    inputTab={inputTab} setInputTab={setInputTab}
    manualNomor={manualNomor} setManualNomor={setManualNomor}
    manualMarketplace={manualMarketplace} setManualMarketplace={setManualMarketplace}
    manualError={manualError} setManualError={setManualError}
    isDragging={isDragging} setIsDragging={setIsDragging}
    csvStatus={csvStatus} csvError={csvError} csvPreview={csvPreview} fileInputRef={fileInputRef}
    internalSearch={internalSearch} setInternalSearch={setInternalSearch}
    internalMpFilter={internalMpFilter} setInternalMpFilter={setInternalMpFilter}
    isComparing={isComparing} compareError={compareError} comparisonResults={comparisonResults}
    resultFilter={resultFilter} setResultFilter={setResultFilter}
    filteredInternal={filteredInternal} canCompare={canCompare} cocokCount={cocokCount} tidakCocokCount={tidakCocokCount} tidakDitemukanCount={tidakDitemukanCount} totalResult={totalResult} matchRate={matchRate} filteredResults={filteredResults} steps={steps}
    processFile={processFile} handleDrop={handleDrop} handleImportCSV={handleImportCSV} downloadTemplate={downloadTemplate} handleCompare={handleCompare} handleReset={handleReset} downloadResults={downloadResults}
    onClearMarketplace={handleClearMarketplace} onDeleteMarketplace={handleDeleteMarketplace}
    manualFormAction={manualFormAction} isManualPending={isManualPending} formState={formState}
  />;
}
