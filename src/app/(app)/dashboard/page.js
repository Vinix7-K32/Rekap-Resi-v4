'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, subDays } from 'date-fns';
import { toast } from 'sonner';
import DashboardUI from '@/components/app/dashboard-ui';
import { getResiList } from '@/services/resi';

export default function DashboardPage() {
  const [resiList, setResiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

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
          return;
        }

        setResiList(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!active) return;
        setErrorMessage('Terjadi kesalahan saat memuat data.');
        setResiList([]);
        toast.error('Terjadi kesalahan tak terduga');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadResi();

    return () => {
      active = false;
    };
  }, []);

  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const weekKey = format(subDays(new Date(), 7), 'yyyy-MM-dd');
  const monthKey = format(new Date(), 'yyyy-MM');

  const totalResi = resiList.length;

  const todayCount = useMemo(
    () => resiList.filter((resi) => resi.tanggal === todayKey).length,
    [resiList, todayKey]
  );

  const weekCount = useMemo(
    () => resiList.filter((resi) => (resi.tanggal ?? '') >= weekKey).length,
    [resiList, weekKey]
  );

  const monthCount = useMemo(
    () => resiList.filter((resi) => (resi.tanggal ?? '').startsWith(monthKey)).length,
    [resiList, monthKey]
  );

  const chartData = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const day = subDays(new Date(), 13 - index);
      const dateKey = format(day, 'yyyy-MM-dd');
      const count = resiList.filter((resi) => resi.tanggal === dateKey).length;

      return {
        date: format(day, 'dd/MM'),
        count,
        fullDate: dateKey,
      };
    });
  }, [resiList]);

  const marketplaceDist = useMemo(() => {
    const counts = new Map();

    resiList.forEach((resi) => {
      if (!resi.marketplace) return;
      counts.set(resi.marketplace, (counts.get(resi.marketplace) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [resiList]);

  const recentResi = useMemo(() => {
    return [...resiList]
      .sort((a, b) => {
        const dateA = a.tanggal ?? a.created_at ?? '';
        const dateB = b.tanggal ?? b.created_at ?? '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 10);
  }, [resiList]);

  const kpiValues = { totalResi, todayCount, weekCount, monthCount };

  return (
    <DashboardUI
      kpiValues={kpiValues}
      totalResi={totalResi}
      chartData={chartData}
      marketplaceDist={marketplaceDist}
      recentResi={recentResi}
      onCreateResi={() => router.push('/tambah-resi')}
      onViewAll={() => router.push('/daftar-resi')}
      loading={loading}
      errorMessage={errorMessage}
    />
  );
}
