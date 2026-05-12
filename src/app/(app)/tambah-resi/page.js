'use client';

import { useState, useTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import TambahResiUI from '@/components/app/tambah-resi-ui';
import { tambahResiAction, tambahResiByScanner } from './actions';

const LS_KEY = 'scanner_error_list';

export default function TambahResiPage() {
  // ── Tab state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('manual');

  // ── Form state — input manual ──────────────────────────────────────────────
  const [formState, formAction, isPending] = useActionState(tambahResiAction, {
    success: false,
    error: '',
    message: '',
    fieldErrors: {},
  });

  // ── Scanner state ──────────────────────────────────────────────────────────
  const [isScanPending, startScanTransition] = useTransition();

  // Hydrate error list dari localStorage saat pertama render (client only)
  const [errorList, setErrorList] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  // Nomor resi yang dikirim dari tabel error ke form manual (untuk pre-fill)
  const [defaultNomorResi, setDefaultNomorResi] = useState('');

  // Sync errorList ke localStorage setiap kali berubah
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(errorList));
    } catch {
      // localStorage tidak tersedia (private mode, dll) — abaikan
    }
  }, [errorList]);

  // Saat form manual berhasil submit, hapus nomor resi dari tabel error (jika ada)
  useEffect(() => {
    if (formState?.success && formState.data?.nomor_resi) {
      const submitted = formState.data.nomor_resi;
      setErrorList((prev) => prev.filter((item) => item.nomor_resi !== submitted));
      setDefaultNomorResi('');
    }
  }, [formState]);

  // ── Handler: auto-upload setelah scan ─────────────────────────────────────
  const handleScan = (nomor_resi) => {
    startScanTransition(async () => {
      const result = await tambahResiByScanner(nomor_resi);

      if (result.success) {
        toast.success('Resi berhasil ditambahkan!', {
          description: nomor_resi,
        });
      } else if (result.duplicate) {
        setErrorList((prev) => {
          // Hindari duplikasi di tabel error
          if (prev.some((item) => item.nomor_resi === nomor_resi)) return prev;
          return [...prev, { nomor_resi, scannedAt: new Date().toISOString() }];
        });
        toast.error('Nomor resi sudah terdaftar', {
          description: `${nomor_resi} sudah ada di database.`,
        });
      } else {
        toast.error('Gagal menyimpan resi', {
          description: result.error ?? 'Terjadi kesalahan.',
        });
      }
    });
  };

  // ── Handler: hapus item dari tabel error ──────────────────────────────────
  const handleRemoveError = (nomor_resi) => {
    setErrorList((prev) => prev.filter((item) => item.nomor_resi !== nomor_resi));
  };

  // ── Handler: pindah ke tab manual + pre-fill field nomor resi ─────────────
  const handleManualAdd = (nomor_resi) => {
    setDefaultNomorResi(nomor_resi);
    setActiveTab('manual');
    // Hapus dari tabel error setelah berhasil dipindahkan ke form manual
    // (penghapusan final terjadi setelah submit berhasil, lihat TambahResiForm)
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <TambahResiUI
      activeTab={activeTab}
      onTabChange={setActiveTab}
      formState={formState}
      formAction={formAction}
      isPending={isPending}
      onScan={handleScan}
      isScanPending={isScanPending}
      errorList={errorList}
      onRemoveError={handleRemoveError}
      onManualAdd={handleManualAdd}
      defaultNomorResi={defaultNomorResi}
    />
  );
}
