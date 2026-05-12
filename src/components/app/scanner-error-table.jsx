'use client';

import { motion, AnimatePresence } from 'motion/react';
import { MdErrorOutline, MdDeleteOutline, MdEditNote } from 'react-icons/md';
import { format } from 'date-fns';

/**
 * ScannerErrorTable — tabel sementara untuk resi duplikat hasil scan.
 *
 * Props:
 *   errorList: Array<{ nomor_resi: string, scannedAt: string (ISO) }>
 *   onRemove(nomor_resi)  — hapus item dari tabel + localStorage
 *   onManualAdd(nomor_resi) — pindah ke tab manual dan isi field nomor resi
 */
export default function ScannerErrorTable({ errorList = [], onRemove, onManualAdd }) {
  if (!errorList.length) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: '1px solid #FEE2E2',
        backgroundColor: '#FFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-3 shrink-0"
        style={{ backgroundColor: '#FFF5F5', borderBottom: '1px solid #FEE2E2' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: '#FEE2E2' }}
        >
          <MdErrorOutline size={16} style={{ color: '#DC2626' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-red-700 font-semibold leading-tight" style={{ fontSize: '0.85rem' }}>
            Resi Duplikat
          </p>
          <p className="text-red-400 leading-tight" style={{ fontSize: '0.72rem' }}>
            {errorList.length} nomor resi sudah terdaftar
          </p>
        </div>
        <span
          className="px-2 py-0.5 rounded-full text-red-700 font-bold shrink-0"
          style={{ backgroundColor: '#FEE2E2', fontSize: '0.75rem' }}
        >
          {errorList.length}
        </span>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: '320px' }}>
        <AnimatePresence initial={false}>
          {errorList.map((item, index) => (
            <motion.div
              key={item.nomor_resi}
              initial={{ opacity: 0, x: 10, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: index < errorList.length - 1 ? '1px solid #FEF2F2' : 'none',
              }}
            >
              {/* Nomor urut */}
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-red-400 font-semibold"
                style={{ backgroundColor: '#FEF2F2', fontSize: '0.7rem' }}
              >
                {index + 1}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-slate-700 font-mono font-semibold truncate"
                  style={{ fontSize: '0.82rem' }}
                >
                  {item.nomor_resi}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="px-1.5 py-0.5 rounded-full font-semibold text-red-600"
                    style={{ backgroundColor: '#FEE2E2', fontSize: '0.65rem', letterSpacing: '0.03em' }}
                  >
                    DUPLIKAT
                  </span>
                  <span className="text-slate-400" style={{ fontSize: '0.7rem' }}>
                    {item.scannedAt
                      ? format(new Date(item.scannedAt), 'HH:mm:ss')
                      : '-'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onManualAdd?.(item.nomor_resi)}
                  title="Tambah manual"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#3B82F6',
                    border: '1px solid #BFDBFE',
                  }}
                >
                  <MdEditNote size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove?.(item.nomor_resi)}
                  title="Hapus dari daftar"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105"
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FEE2E2',
                  }}
                >
                  <MdDeleteOutline size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer — clear all */}
      <div
        className="px-4 py-2.5 flex items-center justify-between shrink-0"
        style={{ borderTop: '1px solid #FEE2E2', backgroundColor: '#FFF5F5' }}
      >
        <p className="text-red-300" style={{ fontSize: '0.72rem' }}>
          Data disimpan di perangkat ini
        </p>
        <button
          type="button"
          onClick={() => errorList.forEach((item) => onRemove?.(item.nomor_resi))}
          className="text-red-500 hover:text-red-700 transition-colors cursor-pointer font-medium"
          style={{ fontSize: '0.75rem' }}
        >
          Hapus semua
        </button>
      </div>
    </div>
  );
}
