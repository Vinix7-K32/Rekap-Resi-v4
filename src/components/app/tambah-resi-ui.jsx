'use client';

import { motion, AnimatePresence } from 'motion/react';
import { MdKeyboard } from 'react-icons/md';
import { RiBarcodeLine } from 'react-icons/ri';
import { LuLightbulb } from 'react-icons/lu';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import TambahResiForm from '@/components/app/tambah-resi-form';
import ScannerBarcode from '@/components/app/scanner-barcode';
import ScannerErrorTable from '@/components/app/scanner-error-table';

const SCANNER_TIPS = [
  'Pastikan pencahayaan cukup agar kamera dapat membaca barcode dengan jelas.',
  'Arahkan barcode resi ke tengah frame kamera dan tahan sebentar.',
  'Gunakan input manual di bawah kamera jika scanner tidak berhasil membaca.',
  'Jika nomor resi sudah ada di database, data akan muncul di tabel duplikat di samping scanner.',
];

/**
 * TambahResiUI — komponen UI utama halaman /tambah-resi.
 * Menerima semua state dan handler dari page.js sebagai props.
 */
export default function TambahResiUI({
  activeTab,
  onTabChange,
  formState,
  formAction,
  isPending,
  onScan,
  isScanPending,
  errorList = [],
  onRemoveError,
  onManualAdd,
  defaultNomorResi = '',
}) {
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-1"
      >
        <h1 className="text-[1.4rem] font-bold text-slate-800">Tambah Resi Baru</h1>
        <p className="text-[0.9rem] text-slate-500">
          Tambahkan nomor resi pengembalian secara manual atau gunakan scanner barcode
        </p>
      </motion.div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-5">
          {/* Tab List — same style as /daftar-resi */}
          <TabsList className="h-10 rounded-xl px-1">
            <TabsTrigger
              value="manual"
              className="flex items-center gap-2 px-4 text-[0.85rem]"
            >
              <MdKeyboard size={15} />
              Input Manual
            </TabsTrigger>
            <TabsTrigger
              value="scanner"
              className="flex items-center gap-2 px-4 text-[0.85rem]"
            >
              <RiBarcodeLine size={15} />
              Scanner Barcode
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Input Manual ─────────────────────────────────── */}
          <TabsContent value="manual">
            <AnimatePresence mode="wait">
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <TambahResiForm
                  formState={formState}
                  formAction={formAction}
                  isPending={isPending}
                  defaultNomorResi={defaultNomorResi}
                />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* ── Tab: Scanner Barcode ──────────────────────────────── */}
          <TabsContent value="scanner">
            <AnimatePresence mode="wait">
              <motion.div
                key="scanner"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.18 }}
              >
                {/*
                  Layout responsif:
                  - Mobile  : 1 kolom (scanner atas, error table bawah)
                  - Desktop : 2 kolom (scanner kiri, error table kanan jika ada)
                */}
                <div
                  className={`grid gap-4 ${
                    errorList.length > 0
                      ? 'grid-cols-1 lg:grid-cols-[1fr_360px]'
                      : 'grid-cols-1'
                  }`}
                >
                  {/* Scanner card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.04)]">
                    <ScannerBarcode onScan={onScan} isProcessing={isScanPending} />
                  </div>

                  {/* Error table — muncul hanya jika ada duplikat */}
                  <AnimatePresence>
                    {errorList.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ScannerErrorTable
                          errorList={errorList}
                          onRemove={onRemoveError}
                          onManualAdd={onManualAdd}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* ── Tips ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-blue-100 bg-blue-50 p-5"
      >
        <h3 className="mb-3 flex items-center gap-2 text-[0.9rem] font-semibold text-blue-800">
          <LuLightbulb size={16} className="text-blue-600" />
          Tips Penggunaan
        </h3>
        <ul className="space-y-1.5">
          {SCANNER_TIPS.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[0.82rem] text-blue-700"
            >
              <span className="mt-0.5 shrink-0 text-blue-400">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
