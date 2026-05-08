'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { tambahResiAction } from '@/app/(app)/tambah-resi/actions';
import { MdErrorOutline, MdRefresh, MdSaveAlt } from 'react-icons/md';

const MARKETPLACES = ['Shopee', 'Tokopedia', 'Lazada', 'Bukalapak', 'TikTok Shop'];
const KURIR = ['JNE', 'J&T', 'SiCepat', 'Anteraja', 'Pos Indonesia'];
const FIXED_STATUS = 'Diterima';

export default function TambahResiForm() {
  const [formState, formAction, isPending] = useActionState(tambahResiAction, {
    success: false,
    error: "",
    message: "",
    fieldErrors: {},
  });

  const formRef = useRef(null);

  const [marketplace, setMarketplace] = useState('');
  const [kurir, setKurir] = useState('');

  const handleReset = () => {
    formRef.current?.reset();
    setMarketplace('');
    setKurir('');
  };

  useEffect(() => {
    if (formState?.success) {
      toast.success(formState.message, {
        description: `Nomor resi ${formState.data?.nomor_resi} telah ditambahkan.`,
      });
      setTimeout(() => handleReset(), 0);
    } else if (formState?.error) {
      toast.error('Gagal menyimpan resi', {
        description: formState.error,
      });
    }
  }, [formState]);

  const fieldClass = (hasError) =>
    `h-10 w-full rounded-xl border px-4 py-2.5 text-slate-700 text-[0.9rem] outline-none transition-all focus-visible:ring-2 bg-[#F8FAFC] ${
      hasError
        ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100'
        : 'border-slate-200 focus-visible:border-blue-400 focus-visible:ring-blue-100'
    }`;

  return (
    <div className="space-y-5">
      <form action={formAction} ref={formRef} className="space-y-5">
        {/* Nomor Resi */}
        <div className="space-y-1.5">
          <Label htmlFor="nomor_resi" className="text-slate-700 font-semibold text-[0.85rem]">
            Nomor Resi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nomor_resi"
            name="nomor_resi"
            placeholder="Contoh: JNE000000000001"
            className={fieldClass(!!formState?.fieldErrors?.nomor_resi)}
            style={{ fontFamily: 'monospace' }}
          />
          <AnimatePresence>
            {formState?.fieldErrors?.nomor_resi && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-red-500"
                style={{ fontSize: '0.78rem' }}
              >
                <MdErrorOutline size={13} />
                {formState.fieldErrors.nomor_resi[0]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Marketplace + Kurir */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Marketplace */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-semibold text-[0.85rem]">
              Marketplace <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" name="marketplace" value={marketplace} />
            <Select value={marketplace} onValueChange={setMarketplace}>
              <SelectTrigger
                className={`w-full h-10 rounded-xl px-4 text-[0.9rem] bg-[#F8FAFC] ${
                  formState?.fieldErrors?.marketplace ? 'border-red-300' : 'border-slate-200'
                }`}
              >
                <SelectValue placeholder="Pilih Marketplace" />
              </SelectTrigger>
              <SelectContent>
                {MARKETPLACES.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState?.fieldErrors?.marketplace && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {formState.fieldErrors.marketplace[0]}
              </p>
            )}
          </div>

          {/* Kurir */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-semibold text-[0.85rem]">
              Kurir <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" name="kurir" value={kurir} />
            <Select value={kurir} onValueChange={setKurir}>
              <SelectTrigger
                className={`w-full h-10 rounded-xl px-4 text-[0.9rem] bg-[#F8FAFC] ${
                  formState?.fieldErrors?.kurir ? 'border-red-300' : 'border-slate-200'
                }`}
              >
                <SelectValue placeholder="Pilih Kurir" />
              </SelectTrigger>
              <SelectContent>
                {KURIR.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState?.fieldErrors?.kurir && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {formState.fieldErrors.kurir[0]}
              </p>
            )}
          </div>
        </div>

        {/* Status + Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-semibold text-[0.85rem]">Status</Label>
            <Input
              name="status"
              value={FIXED_STATUS}
              readOnly
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[0.9rem] text-slate-600"
            />
            <p className="text-[0.75rem] text-slate-400">Status otomatis dari input manual.</p>
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <Label htmlFor="tanggal" className="text-slate-700 font-semibold text-[0.85rem]">
              Tanggal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              name="tanggal"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              className={fieldClass(!!formState?.fieldErrors?.tanggal)}
            />
            {formState?.fieldErrors?.tanggal && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {formState.fieldErrors.tanggal[0]}
              </p>
            )}
          </div>
        </div>

        {/* Nama Penerima */}
        <div className="space-y-1.5">
          <Label htmlFor="nama_penerima" className="text-slate-700 font-semibold text-[0.85rem]">
            Nama Penerima{' '}
            <span className="text-slate-400 font-normal" style={{ fontSize: '0.78rem' }}>
              (opsional)
            </span>
          </Label>
          <Input
            id="nama_penerima"
            name="nama_penerima"
            placeholder="Nama penerima paket"
            className={fieldClass(false)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={isPending}
            whileHover={{ scale: isPending ? 1 : 1.02 }}
            whileTap={{ scale: isPending ? 1 : 0.98 }}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3 text-white transition-all disabled:opacity-60 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              boxShadow: '0 4px 15px rgba(59,130,246,0.35)',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <MdSaveAlt size={20} />
                Simpan Resi
              </>
            )}
          </motion.button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
            style={{ border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
          >
            <MdRefresh size={17} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
