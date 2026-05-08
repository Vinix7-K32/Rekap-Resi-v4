'use client';

import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Download,
  FileCheck,
  FileX,
  Filter,
  GitCompare,
  Info,
  MinusCircle,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Store,
  Upload,
  X,
  XCircle,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { MARKETPLACES, VERIFICATION_CONFIG } from '@/app/(app)/cek-resi/page';

const MARKETPLACE_STYLES = {
  Shopee: 'bg-orange-50 text-orange-600 border-orange-200',
  Tokopedia: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  Lazada: 'bg-blue-50 text-blue-600 border-blue-200',
  Bukalapak: 'bg-red-50 text-red-600 border-red-200',
  'TikTok Shop': 'bg-violet-50 text-violet-600 border-violet-200',
};

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

const ICONS = {
  cocok: CheckCircle,
  tidak_cocok: XCircle,
  tidak_ditemukan: MinusCircle,
}

function MarketplacePill({ marketplace }) {
  const style = MARKETPLACE_STYLES[marketplace] ?? 'bg-slate-100 text-slate-500 border-slate-200';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg border px-2.5 py-1 text-[0.75rem] font-semibold',
        style
      )}
    >
      {marketplace}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.Menunggu;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold',
        styles.pill
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} />
      {status}
    </span>
  );
}

function EmptyBox({ icon: Icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8">
      <Icon size={26} className="text-slate-300" />
      <p className="text-[0.82rem] text-slate-400">{text}</p>
    </div>
  );
}

function formatTanggal(value) {
  if (!value) return '-';
  const parsed = parseISO(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return format(parsed, 'd MMM yyyy', { locale: localeId });
}

export function CekResiUI({
  resiList, loading, loadError,
  marketplaceData, marketplaceLoading, marketplaceError,
  inputTab, setInputTab,
  manualNomor, setManualNomor,
  manualMarketplace, setManualMarketplace,
  manualError, setManualError,
  isDragging, setIsDragging,
  csvStatus, csvError, csvPreview, fileInputRef,
  internalSearch, setInternalSearch,
  internalMpFilter, setInternalMpFilter,
  isComparing, compareError, comparisonResults,
  resultFilter, setResultFilter,
  filteredInternal, canCompare, cocokCount, tidakCocokCount, tidakDitemukanCount, totalResult, matchRate, filteredResults, steps,
  processFile, handleDrop, handleImportCSV, downloadTemplate, handleCompare, handleReset, downloadResults,
  onClearMarketplace, onDeleteMarketplace,
  manualFormAction, isManualPending, formState,
}) {
  return (
    <div className="space-y-6 pb-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-[1.4rem] font-bold text-slate-800">Check & Verifikasi Resi</h1>
          <p className="mt-1 text-[0.88rem] text-slate-500">
            Cocokkan data resi dari marketplace dengan data resi internal yang sudah dicatat
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="self-start rounded-xl border-slate-200 px-4 py-2.5 text-[0.84rem] text-slate-500 hover:text-red-500"
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          Reset Semua
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06 }}
        className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-4"
      >
        {steps.map((step, index) => (
          <div
            key={step.num}
            className={cn(
              'relative flex flex-col items-center gap-1 px-3 py-3.5 text-center sm:flex-row sm:gap-3 sm:text-left',
              step.done && 'bg-blue-50'
            )}
          >
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                step.done
                  ? 'bg-blue-600 text-white shadow-[0_3px_10px_rgba(37,99,235,0.3)]'
                  : 'bg-slate-100 text-slate-400'
              )}
            >
              {step.done ? <CheckCircle size={15} /> : <span className="text-[0.78rem] font-bold">{step.num}</span>}
            </div>
            <div className="min-w-0">
              <p className={cn('text-[0.78rem] font-semibold', step.done ? 'text-blue-700' : 'text-slate-500')}>
                {step.label}
              </p>
              <p className={cn('text-[0.68rem]', step.done ? 'text-blue-500' : 'text-slate-400')}>{step.sub}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-0 hidden h-full w-px bg-slate-200 md:block" />
            )}
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div className="border-b border-slate-100 px-6 pb-4 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50">
                  <Store size={17} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[0.95rem] font-bold text-slate-800">Data Marketplace</h2>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.65rem] font-bold text-white">
                      1
                    </span>
                  </div>
                  <p className="text-[0.73rem] text-slate-400">{marketplaceData.length} resi ditambahkan</p>
                </div>
              </div>
              {marketplaceData.length > 0 && (
                <button
                  type="button"
                  onClick={onClearMarketplace}
                  className="text-slate-300 transition-colors hover:text-red-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {[
                { key: 'manual', label: 'Input Manual', Icon: Plus },
                { key: 'csv', label: 'Import CSV', Icon: Upload },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setInputTab(key);
                    setManualError('');
                  }}
                  className={cn(
                    'flex-1 rounded-lg py-2 text-[0.82rem] transition-all',
                    inputTab === key
                      ? 'bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-[0_2px_8px_rgba(59,130,246,0.25)]'
                      : 'text-slate-500'
                  )}
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Icon size={13} />
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-5">
            <AnimatePresence mode="wait">
              {inputTab === 'manual' && (
                <motion.div
                  key="manual"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  <form action={manualFormAction} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[0.8rem] font-semibold text-slate-600">Nomor Resi</Label>
                      <Input
                        name="nomor_resi"
                        value={manualNomor}
                        onChange={(event) => {
                          setManualNomor(event.target.value);
                          setManualError('');
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            event.currentTarget.form?.requestSubmit();
                          }
                        }}
                        placeholder="Ketik nomor resi, tekan Enter..."
                        className={cn(
                          'h-10 rounded-xl border-slate-200 bg-slate-50 font-mono text-[0.88rem] text-slate-700 focus-visible:ring-blue-100',
                          (manualError && !manualNomor.trim()) || formState?.fieldErrors?.nomor_resi ? 'border-red-300 focus-visible:ring-red-100' : ''
                        )}
                      />
                      {formState?.fieldErrors?.nomor_resi && (
                        <p className="text-[0.78rem] font-semibold text-red-500">
                          {formState.fieldErrors.nomor_resi[0]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[0.8rem] font-semibold text-slate-600">Marketplace</Label>
                      <input type="hidden" name="marketplace" value={manualMarketplace} />
                      <Select
                        value={manualMarketplace}
                        onValueChange={(value) => {
                          setManualMarketplace(value);
                          setManualError('');
                        }}
                      >
                        <SelectTrigger
                          className={cn(
                            'h-10 rounded-xl border-slate-200 bg-slate-50 text-[0.88rem] text-slate-600',
                            (manualError && !manualMarketplace) || formState?.fieldErrors?.marketplace ? 'border-red-300' : ''
                          )}
                        >
                          <SelectValue placeholder="Pilih Marketplace" />
                        </SelectTrigger>
                        <SelectContent>
                          {MARKETPLACES.map((marketplace) => (
                            <SelectItem key={marketplace} value={marketplace}>
                              {marketplace}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formState?.fieldErrors?.marketplace && (
                        <p className="text-[0.78rem] font-semibold text-red-500">
                          {formState.fieldErrors.marketplace[0]}
                        </p>
                      )}
                    </div>
                    <AnimatePresence>
                      {manualError && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2"
                        >
                          <AlertTriangle size={13} className="text-red-500" />
                          <span className="text-[0.78rem] text-red-600">{manualError}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button
                      type="submit"
                      disabled={isManualPending}
                      className="h-10 w-full rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-[0.88rem] shadow-[0_4px_12px_rgba(59,130,246,0.28)] disabled:opacity-60"
                    >
                      {isManualPending ? (
                        <>
                          <Spinner className="mr-2 size-4 border-2 border-white/30 border-t-white" />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <Plus size={15} />
                          Tambah Data
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {inputTab === 'csv' && (
                <motion.div
                  key="csv"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => csvStatus !== 'loading' && fileInputRef.current?.click()}
                    className={cn(
                      'cursor-pointer rounded-xl border-2 border-dashed px-5 py-7 text-center transition-all',
                      isDragging && 'border-blue-400 bg-blue-50',
                      csvStatus === 'error' && 'border-red-300 bg-red-50',
                      csvStatus === 'success' && 'border-emerald-300 bg-emerald-50',
                      csvStatus === 'idle' && !isDragging && 'border-slate-300 bg-slate-50'
                    )}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) processFile(file);
                        event.target.value = '';
                      }}
                    />
                    {csvStatus === 'loading' && (
                      <div className="flex flex-col items-center gap-3">
                        <Spinner className="size-8 text-blue-500" />
                        <p className="text-[0.85rem] font-semibold text-blue-600">Memproses file...</p>
                      </div>
                    )}
                    {csvStatus === 'idle' && (
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-2xl',
                            isDragging ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-400'
                          )}
                        >
                          <Upload size={22} />
                        </div>
                        <p className="text-[0.88rem] font-semibold text-slate-700">
                          {isDragging ? 'Lepas file di sini' : 'Drag & drop file CSV'}
                        </p>
                        <p className="text-[0.73rem] text-slate-400">atau klik untuk pilih file, maks 2MB</p>
                      </div>
                    )}
                    {csvStatus === 'success' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                          <FileCheck size={22} />
                        </div>
                        <p className="text-[0.85rem] font-semibold text-emerald-700">
                          {csvPreview.length} resi berhasil dibaca
                        </p>
                        <p className="text-[0.72rem] text-emerald-500">Klik untuk ganti file</p>
                      </div>
                    )}
                    {csvStatus === 'error' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                          <FileX size={22} />
                        </div>
                        <p className="text-[0.85rem] font-semibold text-red-600">Upload Gagal</p>
                        <p className="max-w-60 text-[0.73rem] text-red-400">{csvError}</p>
                        <p className="text-[0.7rem] text-red-400">Klik untuk coba lagi</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={downloadTemplate}
                      className="flex-1 rounded-xl border-slate-200 text-[0.8rem] text-slate-500"
                    >
                      <Download size={13} />
                      Unduh Template
                    </Button>
                    <div className="flex-1 overflow-hidden rounded-xl border border-slate-200">
                      <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5">
                        <p className="text-[0.65rem] font-semibold text-slate-400">FORMAT CSV</p>
                      </div>
                      <div className="px-3 py-2 font-mono text-[0.68rem]">
                        <p className="text-slate-400">Nomor Resi,Marketplace</p>
                        <p className="text-slate-600">JNE000001,Shopee</p>
                      </div>
                    </div>
                  </div>

                  {csvStatus === 'success' && csvPreview.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="overflow-hidden rounded-xl border border-emerald-200"
                    >
                      <div className="flex items-center justify-between border-b border-emerald-200 bg-emerald-50 px-4 py-2.5">
                        <p className="text-[0.78rem] font-semibold text-emerald-700">
                          Preview - {csvPreview.length} baris
                        </p>
                      </div>
                      <div className="max-h-32.5 overflow-y-auto">
                        {csvPreview.slice(0, 5).map((entry, index) => (
                          <div
                            key={entry.id}
                            className="flex items-center gap-3 border-b border-emerald-100 px-4 py-2 last:border-0"
                          >
                            <span className="w-4 shrink-0 text-right text-[0.7rem] text-slate-300">
                              {index + 1}
                            </span>
                            <span className="flex-1 truncate font-mono text-[0.78rem] text-slate-700">
                              {entry.nomor_resi}
                            </span>
                            <MarketplacePill marketplace={entry.marketplace} />
                          </div>
                        ))}
                        {csvPreview.length > 5 && (
                          <p className="py-1.5 text-center text-[0.7rem] text-slate-400">
                            +{csvPreview.length - 5} lainnya
                          </p>
                        )}
                      </div>
                      <div className="border-t border-emerald-200 bg-emerald-50 p-3">
                        <Button
                          type="button"
                          onClick={handleImportCSV}
                          className="w-full rounded-lg bg-linear-to-br from-emerald-600 to-emerald-700 text-[0.82rem] shadow-[0_3px_10px_rgba(22,163,74,0.28)]"
                        >
                          <FileCheck size={14} />
                          Import {csvPreview.length} Resi
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {marketplaceLoading ? (
              <EmptyBox icon={Store} text="Memuat data marketplace" />
            ) : marketplaceError ? (
              <EmptyBox icon={Store} text={marketplaceError} />
            ) : marketplaceData.length > 0 ? (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[0.78rem] font-semibold text-slate-600">
                    Daftar Input ({marketplaceData.length})
                  </p>
                  <button
                    type="button"
                    onClick={onClearMarketplace}
                    className="text-[0.73rem] text-slate-400 transition-colors hover:text-red-500"
                  >
                    Hapus Semua
                  </button>
                </div>
                <div className="max-h-50 overflow-y-auto rounded-xl border border-slate-200">
                  {marketplaceData.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.2) }}
                      className="group flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 transition-colors hover:bg-slate-50"
                    >
                      <span className="w-5 shrink-0 text-right text-[0.7rem] text-slate-300">
                        {index + 1}
                      </span>
                      <span className="flex-1 truncate font-mono text-[0.82rem] text-slate-700">
                        {entry.nomor_resi}
                      </span>
                      <MarketplacePill marketplace={entry.marketplace} />
                      <button
                        type="button"
                        onClick={() => onDeleteMarketplace(entry.id)}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X size={13} className="text-slate-300 hover:text-red-400" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyBox icon={Store} text="Belum ada data marketplace ditambahkan" />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.14 }}
          className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
        >
          <div className="border-b border-slate-100 px-6 pb-4 pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
                  <Database size={17} className="text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[0.95rem] font-bold text-slate-800">Data Resi Internal</h2>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[0.65rem] font-bold text-white">
                      2
                    </span>
                  </div>
                  <p className="text-[0.73rem] text-slate-400">Otomatis dari menu Tambah Resi</p>
                </div>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                <span className="text-[0.75rem] font-bold text-emerald-700">{resiList.length} Total</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={internalSearch}
                  onChange={(event) => setInternalSearch(event.target.value)}
                  placeholder="Cari nomor resi..."
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-[0.84rem] text-slate-700 focus-visible:ring-emerald-100"
                />
              </div>
              <Select value={internalMpFilter} onValueChange={setInternalMpFilter}>
                <SelectTrigger className="h-10 min-w-35 rounded-xl border-slate-200 bg-slate-50 text-[0.82rem] text-slate-600">
                  <SelectValue placeholder="Semua MP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua MP</SelectItem>
                  {MARKETPLACES.map((marketplace) => (
                    <SelectItem key={marketplace} value={marketplace}>
                      {marketplace}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(internalSearch || internalMpFilter !== 'all') && (
              <div className="mt-2.5 flex items-center justify-between">
                <p className="text-[0.75rem] text-slate-500">
                  Menampilkan <span className="font-semibold text-blue-600">{filteredInternal.length}</span> dari{' '}
                  {resiList.length} resi
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setInternalSearch('');
                    setInternalMpFilter('all');
                  }}
                  className="flex items-center gap-1 text-[0.73rem] text-slate-400 transition-colors hover:text-slate-600"
                >
                  <X size={11} />
                  Hapus filter
                </button>
              </div>
            )}
          </div>

          <div className="max-h-105 flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-6">
                <EmptyBox icon={Database} text="Memuat data resi internal" />
              </div>
            ) : loadError ? (
              <div className="p-6">
                <EmptyBox icon={Database} text={loadError} />
              </div>
            ) : filteredInternal.length === 0 ? (
              <div className="p-6">
                <EmptyBox
                  icon={Database}
                  text={
                    internalSearch || internalMpFilter !== 'all'
                      ? 'Tidak ada resi sesuai filter'
                      : 'Belum ada data resi internal'
                  }
                />
              </div>
            ) : (
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-50">
                  <tr className="border-b border-slate-100">
                    {['Nomor Resi', 'Marketplace', 'Kurir', 'Status'].map((label) => (
                      <th
                        key={label}
                        className="px-4 py-2.5 text-left text-[0.72rem] font-semibold text-slate-400"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInternal.map((resi) => (
                    <tr
                      key={resi.id}
                      className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-[0.8rem] text-slate-700">{resi.nomor_resi}</span>
                        <p className="text-[0.68rem] text-slate-400">{formatTanggal(resi.tanggal)}</p>
                      </td>
                      <td className="px-4 py-2.5">
                        <MarketplacePill marketplace={resi.marketplace} />
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[0.78rem] text-slate-600">{resi.kurir}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={resi.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
            <Info size={13} className="text-slate-400" />
            <p className="text-[0.72rem] text-slate-400">
              Data ini diambil otomatis dari resi yang sudah dicatat via menu{' '}
              <span className="font-semibold text-slate-500">Tambah Resi</span>
            </p>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className={cn(
          'overflow-hidden rounded-2xl',
          canCompare
            ? 'bg-linear-to-br from-blue-900 via-blue-700 to-blue-600 text-white shadow-[0_8px_32px_rgba(29,78,216,0.25)]'
            : 'border border-slate-200 bg-slate-50'
        )}
      >
        <div className="flex flex-col items-center gap-5 px-6 py-6 sm:flex-row">
          <div className="flex flex-1 items-center justify-center gap-6 text-center sm:justify-start">
            <div>
              <p className={cn('text-[2rem] font-extrabold leading-none', canCompare ? 'text-white' : 'text-slate-300')}>
                {marketplaceData.length}
              </p>
              <p className={cn('mt-1 text-[0.73rem]', canCompare ? 'text-white/70' : 'text-slate-400')}>
                Data Marketplace
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn('h-0.5 w-8 rounded-full', canCompare ? 'bg-white/30' : 'bg-slate-200')} />
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  canCompare ? 'bg-white/15' : 'bg-slate-100'
                )}
              >
                <GitCompare size={16} className={cn(canCompare ? 'text-white' : 'text-slate-400')} />
              </div>
              <div className={cn('h-0.5 w-8 rounded-full', canCompare ? 'bg-white/30' : 'bg-slate-200')} />
            </div>
            <div>
              <p className={cn('text-[2rem] font-extrabold leading-none', canCompare ? 'text-white' : 'text-slate-300')}>
                {resiList.length}
              </p>
              <p className={cn('mt-1 text-[0.73rem]', canCompare ? 'text-white/70' : 'text-slate-400')}>
                Data Internal
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:items-end">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold',
                  canCompare ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-400'
                )}
              >
                3
              </span>
              <span
                className={cn(
                  'text-[0.78rem] font-semibold',
                  canCompare ? 'text-white/80' : 'text-slate-400'
                )}
              >
                Langkah 3 - Bandingkan
              </span>
            </div>

            <AnimatePresence>
              {compareError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5"
                >
                  <AlertTriangle size={12} className="text-red-500" />
                  <span className="text-[0.75rem] text-red-600">{compareError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="button"
              onClick={handleCompare}
              disabled={!canCompare || isComparing}
              className={cn(
                'h-11 min-w-55 rounded-xl text-[0.95rem] font-bold transition-all',
                canCompare
                  ? 'bg-white/20 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur'
                  : 'bg-slate-200 text-slate-400'
              )}
            >
              {isComparing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <GitCompare size={18} />
                  Bandingkan & Verifikasi
                </>
              )}
            </Button>

            {!canCompare && (
              <p className="text-center text-[0.72rem] text-slate-400">
                {marketplaceData.length === 0
                  ? 'Tambahkan data marketplace terlebih dahulu'
                  : 'Data internal belum tersedia'}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {comparisonResults && (
          <motion.div
            id="hasil-perbandingan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div className="border-b border-slate-100 px-6 pb-4 pt-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-200 bg-blue-50">
                    <CheckCircle size={17} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[1rem] font-bold text-slate-800">Hasil Perbandingan</h2>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[0.65rem] font-bold text-white">
                        4
                      </span>
                    </div>
                    <p className="text-[0.73rem] text-slate-400">
                      {totalResult} resi diverifikasi -{' '}
                      {format(new Date(), 'd MMM yyyy, HH:mm', { locale: localeId })}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadResults}
                  className="self-start rounded-xl border-slate-200 text-[0.82rem] text-slate-500"
                >
                  <Download size={14} />
                  Export CSV
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: 'Total Dicek',
                    value: totalResult,
                    tone: 'text-blue-600',
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                  },
                  {
                    label: 'Cocok',
                    value: cocokCount,
                    tone: 'text-emerald-700',
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-200',
                  },
                  {
                    label: 'Tidak Cocok',
                    value: tidakCocokCount,
                    tone: 'text-red-600',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                  },
                  {
                    label: 'Tidak Ditemukan',
                    value: tidakDitemukanCount,
                    tone: 'text-slate-500',
                    bg: 'bg-slate-50',
                    border: 'border-slate-200',
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className={cn('rounded-xl border p-4 text-center', card.bg, card.border)}
                  >
                    <p className={cn('text-[1.8rem] font-extrabold leading-none', card.tone)}>{card.value}</p>
                    <p className={cn('mt-1 text-[0.7rem] font-semibold', card.tone)}>{card.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.8rem] text-slate-500">
                    Tingkat Kecocokan{' '}
                    <span className="text-[0.73rem] text-slate-400">
                      ({cocokCount} cocok dari {totalResult} total)
                    </span>
                  </span>
                  <span
                    className={cn(
                      'text-[0.85rem] font-bold',
                      matchRate >= 80
                        ? 'text-emerald-700'
                        : matchRate >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                    )}
                  >
                    {matchRate}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${matchRate}%` }}
                    transition={{ duration: 1.1, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      matchRate >= 80
                        ? 'bg-linear-to-r from-emerald-500 to-emerald-600'
                        : matchRate >= 50
                          ? 'bg-linear-to-r from-amber-400 to-amber-500'
                          : 'bg-linear-to-r from-red-400 to-red-500'
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3">
              {Object.entries(VERIFICATION_CONFIG).map(([key, cfg]) => {
                const Icon = ICONS[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <Icon size={13} className={cfg.tone} />
                    <span className="text-[0.73rem] text-slate-500">
                      <span className={cn('font-semibold', cfg.tone)}>{cfg.label}</span> - {cfg.desc}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-0 border-b border-slate-100 px-2">
              {[
                {
                  key: 'all',
                  label: 'Semua',
                  count: totalResult,
                  color: 'text-blue-600',
                  badge: 'bg-blue-50 text-blue-600',
                  underline: 'bg-blue-600',
                },
                {
                  key: 'cocok',
                  label: 'Cocok',
                  count: cocokCount,
                  color: 'text-emerald-700',
                  badge: 'bg-emerald-50 text-emerald-700',
                  underline: 'bg-emerald-600',
                },
                {
                  key: 'tidak_cocok',
                  label: 'Tidak Cocok',
                  count: tidakCocokCount,
                  color: 'text-red-600',
                  badge: 'bg-red-50 text-red-600',
                  underline: 'bg-red-500',
                },
                {
                  key: 'tidak_ditemukan',
                  label: 'Tidak Ditemukan',
                  count: tidakDitemukanCount,
                  color: 'text-slate-500',
                  badge: 'bg-slate-100 text-slate-500',
                  underline: 'bg-slate-400',
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setResultFilter(tab.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-3 text-[0.8rem] transition-all',
                    resultFilter === tab.key ? tab.color : 'text-slate-400'
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold',
                      resultFilter === tab.key ? tab.badge : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {tab.count}
                  </span>
                  {resultFilter === tab.key && (
                    <motion.div
                      layoutId="result-tab"
                      className={cn('absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full', tab.underline)}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['#', 'Nomor Resi', 'Marketplace (Input)', 'Data Internal', 'Status Verifikasi'].map(
                      (label) => (
                        <th
                          key={label}
                          className="px-5 py-3 text-left text-[0.72rem] font-semibold text-slate-400"
                        >
                          {label}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Filter size={22} className="text-slate-300" />
                          <p className="text-[0.85rem] text-slate-400">Tidak ada data untuk filter ini</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredResults.map((result, index) => {
                      const cfg = VERIFICATION_CONFIG[result.status];
                      const VIcon = ICONS[result.status];
                      return (
                        <motion.tr
                          key={`${result.nomor_resi}-${index}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.025, 0.35) }}
                          className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                        >
                          <td className="w-10 px-5 py-3.5 text-[0.75rem] text-slate-300">{index + 1}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono text-[0.85rem] font-medium text-slate-700">
                              {result.nomor_resi}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <MarketplacePill marketplace={result.marketplace_input} />
                          </td>
                          <td className="px-5 py-3.5">
                            {result.internal_resi ? (
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <MarketplacePill marketplace={result.internal_resi.marketplace} />
                                  {result.status === 'tidak_cocok' && (
                                    <span className="flex items-center gap-1 rounded border border-red-200 bg-red-50 px-2 py-0.5 text-[0.68rem] text-red-600">
                                      <AlertTriangle size={10} />
                                      Berbeda
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 text-[0.72rem] text-slate-400">
                                  <span>{result.internal_resi.kurir}</span>
                                  <span className="text-slate-200">-</span>
                                  <StatusBadge status={result.internal_resi.status} />
                                  <span className="text-slate-200">-</span>
                                  <span>{formatTanggal(result.internal_resi.tanggal)}</span>
                                </div>
                              </div>
                            ) : (
                              <span className="text-[0.8rem] italic text-slate-300">Tidak ditemukan</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.76rem] font-semibold',
                                cfg.bg,
                                cfg.border,
                                cfg.tone
                              )}
                            >
                              <VIcon size={13} />
                              {cfg.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
