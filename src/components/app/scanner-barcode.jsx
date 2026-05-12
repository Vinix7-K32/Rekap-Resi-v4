'use client';

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { MdCheckCircle, MdErrorOutline, MdRefresh } from 'react-icons/md';
import { RiBarcodeLine } from 'react-icons/ri';
import { LuScan, LuZapOff, LuCamera } from 'react-icons/lu';

// Dynamic import agar tidak di-SSR (navigator.mediaDevices tidak tersedia di server)
const Scanner = dynamic(
  () => import('@yudiel/react-qr-scanner').then((m) => m.Scanner),
  { ssr: false, loading: () => null }
);

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
  const [inputValue, setInputValue] = useState('');

  const inputRef = useRef(null);

  // Dipanggil oleh library saat barcode terdeteksi via kamera
  const handleDetect = useCallback(
    (detectedCodes) => {
      if (!detectedCodes?.length || isProcessing) return;
      const value = detectedCodes[0]?.rawValue;
      if (!value || value.trim().length < 6) return;

      setScanSuccess(true);
      setScanning(false);
      setInputValue(value.trim().toUpperCase());
      onScan(value.trim().toUpperCase());

      // Reset feedback setelah 3 detik
      setTimeout(() => {
        setScanSuccess(false);
        setInputValue('');
      }, 3000);
    },
    [isProcessing, onScan]
  );

  const handleScanError = useCallback((err) => {
    // Abaikan error "No MultiFormat Readers were able to detect the code" (bukan error fatal)
    if (err?.message?.includes('No MultiFormat')) return;
    setScanError('Kamera tidak dapat diakses. Coba izinkan akses kamera di browser.');
    setScanning(false);
  }, []);

  // Dipanggil via input fallback (ketik manual + Enter)
  const handleInputKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    const val = inputValue.trim().toUpperCase();
    if (!val || val.length < 6 || isProcessing) return;

    setScanSuccess(true);
    setScanning(false);
    onScan(val);

    setTimeout(() => {
      setScanSuccess(false);
      setInputValue('');
    }, 3000);
  };

  const handleStartScan = () => {
    setScanError('');
    setScanSuccess(false);
    setScanning(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleStopScan = () => {
    setScanning(false);
  };

  const handleReset = () => {
    setScanning(false);
    setScanSuccess(false);
    setScanError('');
    setInputValue('');
  };

  // Warna corner markers
  const cornerColor = scanSuccess ? '#22C55E' : scanning ? '#3B82F6' : '#64748B';

  return (
    <div className="space-y-4">
      {/* ── Camera View ──────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#0F172A', height: '260px' }}
      >
        {/* Grid overlay dekorasi */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`h${i}`}
              className="absolute w-full border-t"
              style={{ borderColor: '#94A3B8', top: `${(i + 1) * 12.5}%` }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute h-full border-l"
              style={{ borderColor: '#94A3B8', left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        {/* WebRTC Scanner (hanya render saat scanning === true) */}
        {scanning && (
          <div className="absolute inset-0">
            <Scanner
              onScan={handleDetect}
              onError={handleScanError}
              constraints={{ facingMode: 'environment' }}
              styles={{
                container: { width: '100%', height: '100%' },
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
                className="absolute left-0 right-0 h-0.5 rounded-full"
                style={{
                  backgroundColor: '#3B82F6',
                  boxShadow: '0 0 8px 2px rgba(59,130,246,0.5)',
                }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            )}

            {/* Success indicator */}
            <AnimatePresence>
              {scanSuccess && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}
                  >
                    <MdCheckCircle size={30} style={{ color: '#22C55E' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Idle state */}
            {!scanning && !scanSuccess && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <LuCamera
                    size={28}
                    style={{ color: 'rgba(148,163,184,0.5)', margin: '0 auto' }}
                  />
                  <p className="mt-2" style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.75rem' }}>
                    Klik tombol scan
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)' }}
          >
            <div
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: scanSuccess
                  ? '#22C55E'
                  : scanning
                  ? '#3B82F6'
                  : '#64748B',
                animation: scanning ? 'pulse 1s infinite' : 'none',
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' }}>
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
              className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}
            >
              <MdErrorOutline size={15} style={{ color: '#FCA5A5', flexShrink: 0 }} />
              <p style={{ color: '#FCA5A5', fontSize: '0.75rem' }}>{scanError}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Input Fallback (Manual / Scanner HID) ────────────────── */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
      >
        <label className="text-slate-600 block mb-2 font-medium" style={{ fontSize: '0.85rem' }}>
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
            className="flex-1 rounded-xl px-4 py-3 text-slate-700 outline-none transition-all focus:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${scanning ? '#3B82F6' : '#E2E8F0'}`,
              fontSize: '0.9rem',
              boxShadow: scanning ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
              fontFamily: 'monospace',
            }}
          />
          {inputValue && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0' }}
            >
              <MdRefresh size={16} />
            </button>
          )}
        </div>
        <p className="mt-2 text-slate-400" style={{ fontSize: '0.75rem' }}>
          Arahkan scanner ke barcode resi, atau ketik manual lalu tekan{' '}
          <kbd className="px-1 py-0.5 rounded bg-slate-200 text-slate-600 text-[0.7rem] font-mono">Enter</kbd>
        </p>
      </div>

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="flex gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={scanning ? handleStopScan : handleStartScan}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-white transition-all disabled:opacity-50 cursor-pointer"
          style={{
            background: scanning
              ? 'linear-gradient(135deg, #64748B, #475569)'
              : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            boxShadow: scanning
              ? 'none'
              : '0 4px 15px rgba(59,130,246,0.35)',
            fontSize: '0.9rem',
            fontWeight: 600,
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

        {(scanError || scanSuccess) && (
          <button
            type="button"
            onClick={handleReset}
            className="px-4 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            style={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Success Feedback ──────────────────────────────────────── */}
      <AnimatePresence>
        {scanSuccess && inputValue && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
          >
            <MdCheckCircle size={18} style={{ color: '#16A34A' }} />
            <div>
              <p className="text-green-700 font-medium" style={{ fontSize: '0.85rem' }}>
                Resi berhasil discan!
              </p>
              <p className="text-green-600 font-mono" style={{ fontSize: '0.82rem' }}>
                {inputValue}
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
          >
            <div className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin shrink-0" />
            <p className="text-blue-700" style={{ fontSize: '0.85rem' }}>
              Menyimpan resi ke database...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
