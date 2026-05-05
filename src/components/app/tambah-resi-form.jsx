'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

import { addResi } from '@/services/resi';

import { MdErrorOutline, MdRefresh, MdSaveAlt } from 'react-icons/md';

const MARKETPLACES = ['Shopee', 'Tokopedia', 'Lazada', 'Bukalapak', 'TikTok Shop'];
const KURIR = ['JNE', 'J&T', 'SiCepat', 'Anteraja', 'Pos Indonesia'];
const STATUSES = ['Menunggu', 'Dalam Proses', 'Diterima', 'Selesai'];

export default function TambahResiForm() {
  const [submitting, setSubmitting] = useState(false);

  const getDefaultValues = () => ({
    nomor_resi: '',
    marketplace: '',
    kurir: '',
    status: 'Menunggu',
    tanggal: new Date().toISOString().split('T')[0],
    nama_penerima: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: getDefaultValues(),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const { error } = await addResi(data);
      if (error) {
        toast.error('Gagal menyimpan resi', {
          description: error.message,
        });
      } else {
        reset(getDefaultValues());
        toast.success('Resi berhasil disimpan!', {
          description: `Nomor resi ${data.nomor_resi} telah ditambahkan.`,
        });
      }
    } catch (err) {
      toast.error('Terjadi kesalahan tak terduga');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (hasError) =>
    `h-10 w-full rounded-xl border px-4 py-2.5 text-slate-700 text-[0.9rem] outline-none transition-all focus-visible:ring-2 bg-[#F8FAFC] ${
      hasError
        ? 'border-red-300 focus-visible:border-red-400 focus-visible:ring-red-100'
        : 'border-slate-200 focus-visible:border-blue-400 focus-visible:ring-blue-100'
    }`;

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nomor Resi */}
        <div className="space-y-1.5">
          <Label htmlFor="nomor_resi" className="text-slate-700 font-semibold text-[0.85rem]">
            Nomor Resi <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nomor_resi"
            {...register('nomor_resi', {
              required: 'Nomor resi wajib diisi',
              minLength: { value: 6, message: 'Nomor resi minimal 6 karakter' },
            })}
            placeholder="Contoh: JNE000000000001"
            className={fieldClass(!!errors.nomor_resi)}
            style={{ fontFamily: 'monospace' }}
          />
          <AnimatePresence>
            {errors.nomor_resi && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-red-500"
                style={{ fontSize: '0.78rem' }}
              >
                <MdErrorOutline size={13} />
                {errors.nomor_resi.message}
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
            <Controller
              name="marketplace"
              control={control}
              rules={{ required: 'Pilih marketplace' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={`w-full h-10 rounded-xl px-4 text-[0.9rem] bg-[#F8FAFC] ${
                      errors.marketplace ? 'border-red-300' : 'border-slate-200'
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
              )}
            />
            {errors.marketplace && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {errors.marketplace.message}
              </p>
            )}
          </div>

          {/* Kurir */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-semibold text-[0.85rem]">
              Kurir <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="kurir"
              control={control}
              rules={{ required: 'Pilih kurir' }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={`w-full h-10 rounded-xl px-4 text-[0.9rem] bg-[#F8FAFC] ${
                      errors.kurir ? 'border-red-300' : 'border-slate-200'
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
              )}
            />
            {errors.kurir && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {errors.kurir.message}
              </p>
            )}
          </div>
        </div>

        {/* Status + Tanggal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Status */}
          <div className="space-y-1.5">
            <Label className="text-slate-700 font-semibold text-[0.85rem]">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full h-10 rounded-xl px-4 text-[0.9rem] bg-[#F8FAFC] border-slate-200">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Tanggal */}
          <div className="space-y-1.5">
            <Label htmlFor="tanggal" className="text-slate-700 font-semibold text-[0.85rem]">
              Tanggal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tanggal"
              type="date"
              {...register('tanggal', { required: 'Tanggal wajib diisi' })}
              className={fieldClass(!!errors.tanggal)}
            />
            {errors.tanggal && (
              <p className="text-red-500 flex items-center gap-1" style={{ fontSize: '0.78rem' }}>
                <MdErrorOutline size={13} />
                {errors.tanggal.message}
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
            {...register('nama_penerima')}
            placeholder="Nama penerima paket"
            className={fieldClass(false)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: submitting ? 1 : 1.02 }}
            whileTap={{ scale: submitting ? 1 : 0.98 }}
            className="flex-1 flex items-center justify-center gap-2.5 rounded-xl py-3 text-white transition-all disabled:opacity-60 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
              boxShadow: '0 4px 15px rgba(59,130,246,0.35)',
              fontSize: '0.95rem',
              fontWeight: 600,
            }}
          >
            {submitting ? (
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
            onClick={() => reset(getDefaultValues())}
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
