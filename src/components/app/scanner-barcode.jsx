'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { MdCheckCircle, MdErrorOutline, MdRefresh } from 'react-icons/md';
import { LuScan, LuZapOff, LuCamera } from 'react-icons/lu';

// Dynamic import agar tidak di-SSR (navigator.mediaDevices tidak tersedia di server)
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((m) => m.Scanner),
  { ssr: false, loading: () => null }
);

// Cooldown antar-scan agar nomor yang sama tidak dikirim berkali-kali (ms)
const SCAN_COOLDOWN = 2000;

/** Stop semua active video tracks agar kamera benar-benar di-release ke OS */
async function stopAllVideoTracks() {
  try {
    const stream = await navigator.mediaDevices?.getUserMedia({ video: true }).catch(() => null);
    stream?.getTracks().forEach((t) => t.stop());
  } catch (_) { /* ignore */ }
}

/**
 * ScannerBarcode — komponen UI scanner berbasis WebRTC.
 * Props:
 *   onScan(value: string)  — dipanggil saat barcode terdeteksi atau Enter di input fallback
 *   isProcessing: boolean  — disable input saat upload sedang berjalan
 */
export default function ScannerBarcode({ onScan, isProcessing = false }) {
  const [scanning, setScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scanError, setScanError] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [scanKey, setScanKey] = useState(0); // force re-mount Scanner

  const inputRef = useRef(null);
  const lastScanTimeRef = useRef(0);
  const successTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      stopAllVideoTracks();
      clearTimeout(successTimerRef.current);
    };
  }, []);

  // Helper: tampilkan feedback sukses sebentar lalu reset (kamera TETAP aktif)
  const showSuccess = useCallback((value) => {
    setLastScanned(value);
    setScanSuccess(true);
    setInputValue(value);

    clearTimeout(successTimerRef.current);
    successTimerRef.current = setTimeout(() => {
      setScanSuccess(false);
      setInputValue('');
    }, 2000);
  }, []);

  // Dipanggil oleh library saat barcode terdeteksi via kamera
  const handleDetect = useCallback(
    (detectedCodes) => {
      if (!detectedCodes?.length || isProcessing) return;
      const value = detectedCodes[0]?.rawValue?.trim().toUpperCase();
      if (!value || value.length < 6) return;

      // Cooldown: abaikan scan yang sama dalam SCAN_COOLDOWN ms
      const now = Date.now();
      if (now - lastScanTimeRef.current < SCAN_COOLDOWN) return;
      lastScanTimeRef.current = now;

      // Kamera TETAP aktif (tidak setScanning(false))
      showSuccess(value);
      onScan(value);
    },
    [isProcessing, onScan, showSuccess]
  );

  const handleScanError = useCallback((err) => {
    // Abaikan error non-fatal dari library
    if (err?.message?.includes('No MultiFormat')) return;
    if (err?.message?.includes('IndexSizeError')) return;
    // NotReadableError = kamera sedang dipakai aplikasi/tab lain
    if (err?.name === 'NotReadableError' || err?.message?.includes('Could not start video')) {
      setScanError('Kamera sedang dipakai aplikasi lain. Tutup aplikasi/tab lain lalu coba lagi.');
    } else {
      setScanError('Kamera tidak dapat diakses. Pastikan izin kamera sudah diberikan di browser.');
    }
    setScanning(false);
  }, []);

  // Dipanggil via input fallback (ketik manual + Enter)
  const handleInputKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const val = inputValue.trim().toUpperCase();
    if (!val || val.length < 6 || isProcessing) return;

    // Input manual tidak menutup kamera juga
    showSuccess(val);
    onScan(val);
  };

  const handleStartScan = async () => {
    setScanError('');
    setScanSuccess(false);
    // Stop track aktif dulu agar tidak konflik (NotReadableError)
    await stopAllVideoTracks();
    // Beri jeda kecil agar OS benar-benar release kamera
    await new Promise((r) => setTimeout(r, 150));
    setScanKey((k) => k + 1); // force Scanner re-mount bersih
    setScanning(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleStopScan = async () => {
    setScanning(false);
    setScanSuccess(false);
    clearTimeout(successTimerRef.current);
    // Release kamera saat stop agar tidak di-hold OS
    await stopAllVideoTracks();
  };

  const handleReset = () => {
    setScanSuccess(false);
    setScanError('');
    setInputValue('');
  };

  // Warna corner markers — dinamis
  const cornerColor = scanSuccess ? '#22C55E' : scanning ? '#3B82F6' : '#64748B';

  return (
    <div className="space-y-4 flex-col">
      {/* ── Camera View ────────────────────────────────────────────── */}
      <div className="mx-auto relative rounded-2xl bg-slate-900 overflow-hidden" style={{ width: '100%', maxWidth: '480px', height: '320px' }}>

        {/* Grid overlay dekorasi */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-2xl">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute w-full border-t border-slate-400"
              style={{ top: `${(i + 1) * 12.5}%` }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute h-full border-l border-slate-400"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        {/* WebRTC Scanner — render selama scanning aktif, tidak di-unmount setelah detect */}
        {scanning && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <Scanner
              key={scanKey}
              onScan={handleDetect}
              onError={handleScanError}
              constraints={{ video: true }}
              styles={{
                container: { width: '100%', height: '100%', position: 'absolute', inset: 0 },
                video: { width: '100%', height: '100%', objectFit: 'cover' },
              }}
              components={{ finder: false }}
            />
          </div>
        )}

        {/* Scan frame + corner markers */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: '200px', height: '160px' }}>
            {/* Corner markers */}
            {[
              'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
              'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
              'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
              'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-8 h-8 ${cls} transition-colors duration-300`}
                style={{ borderColor: cornerColor }}
              />
            ))}

            {/* Scanning line animasi */}
            {scanning && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 rounded-full bg-blue-500"
                style={{ boxShadow: '0 0 8px 2px rgba(59,130,246,0.5)' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Success flash overlay */}
            <AnimatePresence>
              {scanSuccess && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/20">
                    <MdCheckCircle size={30} className="text-green-500" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle state */}
            {!scanning && !scanSuccess && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <LuCamera size={28} className="text-slate-500/50 mx-auto" />
                  <p className="mt-2 text-[0.75rem] text-slate-500/50">
                    Klik tombol scan
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-sm">
            <div
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: scanSuccess ? '#22C55E' : scanning ? '#3B82F6' : '#64748B',
                animation: scanning ? 'pulse 1s infinite' : 'none',
              }}
            />
            <span className="text-white/80 text-[0.72rem]">
              {isProcessing
                ? 'Menyimpan...'
                : scanSuccess
                ? 'Resi Terdeteksi!'
                : scanning
                ? 'Scanning...'
                : 'Kamera Siap'}
            </span>
          </div>
        </div>

        {/* Error overlay */}
        <AnimatePresence>
          {scanError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/15"
              style={{ border: '1px solid rgba(239,68,68,0.4)' }}
            >
              <MdErrorOutline size={15} className="text-red-300 shrink-0" />
              <p className="text-red-300 text-[0.75rem]">{scanError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input Fallback (Manual / Scanner HID) ──────────────────── */}
      <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200">
        <label className="text-slate-600 block mb-2 font-medium text-[0.85rem]">
          Input Kode Barcode / QR
        </label>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isProcessing}
            placeholder="Scan atau ketik nomor resi, lalu tekan Enter..."
            className="flex-1 rounded-xl px-4 py-3 text-slate-700 outline-none transition-all focus:ring-2 focus:ring-blue-100 disabled:opacity-50 bg-white font-mono text-[0.9rem]"
            style={{ border: `1px solid ${scanning ? '#3B82F6' : '#E2E8F0'}` }}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-white border border-slate-200"
            >
              <MdRefresh size={16} />
            </button>
          )}
        </div>
        <p className="mt-2 text-slate-400 text-[0.75rem]">
          Arahkan scanner ke barcode resi, atau ketik manual lalu tekan{' '}
          <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-[0.7rem] font-mono">Enter</kbd>
        </p>
      </div>

      {/* ── Action Buttons ─────────────────────────────────────────── */}
      <div className="flex gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scanning ? handleStopScan : handleStartScan}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-white font-semibold text-[0.9rem] transition-all disabled:opacity-50 cursor-pointer"
          style={{
            background: scanning
              ? 'linear-gradient(135deg, #64748B, #475569)'
              : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            boxShadow: scanning ? 'none' : '0 4px 15px rgba(59,130,246,0.35)',
          }}
        >
          {scanning ? (
            <>
              <LuZapOff size={18} />
              Stop Scan
            </>
          ) : (
            <>
              <LuScan size={18} />
              {isProcessing ? 'Menyimpan...' : 'Mulai Scan'}
            </>
          )}
        </motion.button>

        {scanError && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer bg-white border border-slate-200 text-[0.875rem]"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Last Scanned Feedback ──────────────────────────────────── */}
      <AnimatePresence>
        {scanSuccess && lastScanned && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 border border-green-200"
          >
            <MdCheckCircle size={18} className="text-green-600 shrink-0" />
            <div>
              <p className="text-green-700 font-medium text-[0.85rem]">
                Resi berhasil discan!
              </p>
              <p className="text-green-600 font-mono text-[0.82rem]">
                {lastScanned}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Processing Feedback ───────────────────────────────────── */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200"
          >
            <div className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin shrink-0" />
            <p className="text-blue-700 text-[0.85rem]">
              Menyimpan resi ke database...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
