'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { MdKeyboard } from 'react-icons/md';
import { RiBarcodeLine } from 'react-icons/ri';
import { LuLightbulb } from 'react-icons/lu';

import TambahResiForm from '@/components/app/tambah-resi-form';

const TABS = [
  { key: 'manual', label: 'Input Manual', Icon: MdKeyboard },
  { key: 'scanner', label: 'Scanner Barcode', Icon: RiBarcodeLine },
];

const TIPS = [
  'Pastikan nomor resi sesuai dengan resi fisik yang diterima.',
  'Pilih kurir dan marketplace yang tepat untuk memudahkan pelacakan.',
  'Fitur scanner barcode akan tersedia segera — pantau pembaruan.',
];

export default function TambahResiPage() {
  const [activeTab, setActiveTab] = useState('manual');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
          >
            <Image src="/icon.svg" alt="Rekap Resi" width={20} height={20} />
          </div>
          <h1 className="text-slate-800" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Tambah Resi Baru
          </h1>
        </div>
        <p className="text-slate-500 ml-12" style={{ fontSize: '0.9rem' }}>
          Tambahkan nomor resi pengembalian secara manual atau gunakan scanner barcode
        </p>
      </motion.div>

      {/* Tab Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex rounded-2xl p-1.5 gap-1"
        style={{
          backgroundColor: '#fff',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3 transition-all cursor-pointer"
            style={{
              fontSize: '0.9rem',
              fontWeight: activeTab === key ? 600 : 400,
              color: activeTab === key ? '#fff' : '#64748B',
              background:
                activeTab === key
                  ? 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                  : 'transparent',
              boxShadow:
                activeTab === key ? '0 4px 15px rgba(59,130,246,0.3)' : 'none',
            }}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-6"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)',
          border: '1px solid #E2E8F0',
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === 'manual' ? (
            <motion.div
              key="manual"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <TambahResiForm />
            </motion.div>
          ) : (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              {/* Camera View Mockup */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#0F172A', height: '260px' }}
              >
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
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

                {/* Scan frame + corner markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative" style={{ width: '200px', height: '160px' }}>
                    {[
                      'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                      'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                      'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                      'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
                    ].map((cls, i) => (
                      <div
                        key={i}
                        className={`absolute w-8 h-8 ${cls}`}
                        style={{ borderColor: '#64748B' }}
                      />
                    ))}

                    {/* Coming soon overlay text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
                        style={{
                          backgroundColor: 'rgba(59,130,246,0.15)',
                          border: '1px solid rgba(59,130,246,0.4)',
                          color: '#93C5FD',
                          letterSpacing: '0.15em',
                        }}
                      >
                        Coming Soon
                      </div>
                      <RiBarcodeLine size={36} style={{ color: 'rgba(148,163,184,0.3)' }} />
                    </div>
                  </div>
                </div>

                {/* Status pill */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(10px)' }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#64748B' }} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                      Fitur Belum Tersedia
                    </span>
                  </div>
                </div>

                {/* Bottom badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'rgba(15,23,42,0.7)',
                      color: 'rgba(148,163,184,0.7)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    Scanner Barcode & QR Code
                  </span>
                </div>
              </div>

              {/* Info section */}
              <div
                className="rounded-2xl p-5 space-y-4"
                style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}
                  >
                    <RiBarcodeLine size={18} style={{ color: '#3B82F6' }} />
                  </div>
                  <div>
                    <p className="text-slate-700 font-semibold" style={{ fontSize: '0.9rem' }}>
                      Fitur Scanner Segera Hadir
                    </p>
                    <p className="text-slate-400 mt-0.5" style={{ fontSize: '0.82rem' }}>
                      Kami sedang mengembangkan fitur scan barcode & QR Code untuk mempercepat input resi.
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 pl-1">
                  {[
                    'Scan barcode resi langsung dari kamera',
                    'Mendukung format QR Code dan barcode 1D',
                    'Nomor resi otomatis terisi tanpa ketik manual',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2" style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: '#3B82F6', opacity: 0.5 }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setActiveTab('manual')}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 transition-all cursor-pointer hover:opacity-80"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                  }}
                >
                  <MdKeyboard size={18} />
                  Gunakan Input Manual Sekarang
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-5"
        style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}
      >
        <h3
          className="text-blue-800 mb-3 flex items-center gap-2"
          style={{ fontSize: '0.9rem', fontWeight: 600 }}
        >
          <LuLightbulb size={16} className="text-blue-600" />
          Tips Penggunaan
        </h3>
        <ul className="space-y-1.5">
          {TIPS.map((tip, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-blue-700"
              style={{ fontSize: '0.82rem' }}
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
