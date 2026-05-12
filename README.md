# Rekap Resi

Rekap Resi adalah aplikasi manajemen resi retur berbasis Next.js 16 yang menggabungkan:

- landing page publik untuk promosi produk,
- autentikasi Supabase berbasis cookie,
- penyimpanan data utama dengan Prisma + PostgreSQL,
- dashboard internal untuk input, verifikasi, dan pengelolaan resi.

Dokumentasi ini disusun dari kondisi implementasi aktual di workspace `rekapresi`, bukan dari template bawaan `create-next-app`.

## Ringkasan Fitur

- Landing page publik dengan section hero, statistik, fitur, alur kerja, marketplace, testimoni, dan CTA.
- Login, register, dan logout memakai Supabase Auth SSR.
- Proteksi route app dan route API melalui `src/proxy.js`.
- Dashboard KPI dengan statistik total, hari ini, 7 hari terakhir, bulan ini, distribusi marketplace, tren 14 hari, dan daftar 10 resi terbaru.
- Input resi internal pada `/tambah-resi` dengan validasi Zod dan status otomatis `Diterima`.
- Verifikasi resi pada `/cek-resi` dengan input marketplace manual, import CSV, progress bar, partial result, dan export hasil verifikasi.
- Daftar resi pada `/daftar-resi` dengan URL as state, filter, sorting, pagination, dan optimistic delete.
- Loading, error, not found, dan skeleton UI untuk route app.

## Stack

| Layer | Tooling | Catatan |
|---|---|---|
| Framework | Next.js `16.2.4` | App Router |
| Runtime | React `19.2.4` | Client + Server Components |
| Styling | Tailwind CSS `v4` | `src/app/globals.css` |
| UI kit | shadcn/ui | Style `radix-nova`, komponen di `src/components/ui` |
| Motion | `motion` | Animasi halaman dan transisi UI |
| Auth | `@supabase/ssr` + `@supabase/supabase-js` | Session berbasis cookie |
| ORM | Prisma `7.8.0` | Adapter `@prisma/adapter-pg` |
| Database | PostgreSQL | Runtime via `pg` pool |
| Validation | Zod | Dipakai di server actions |
| Feedback UI | Sonner | Toast sukses/gagal |
| Charts | Recharts | Dashboard |
| Linting | ESLint `9` + `eslint-config-next` | Core Web Vitals |

## Arsitektur Utama

Proyek ini memakai arsitektur hybrid:

- autentikasi user dikelola oleh Supabase,
- data bisnis resi dikelola oleh Prisma,
- route app dan API diproteksi oleh `proxy.js`,
- client pages mengakses data lewat kombinasi server action dan route handler.

### Direktori penting

```text
src/
  app/
    (landing)/page.js                  # Landing page publik
    (auth)/                            # Login, register, auth actions
    (app)/                             # Halaman internal setelah login
    api/                               # Route handler data resi
    layout.js                          # Root layout, font, theme, toaster
    globals.css
  components/
    app/                               # UI halaman internal
    landing/                           # UI landing page
    ui/                                # Komponen shadcn/ui
  hooks/
    use-debounce.js                    # Debounce untuk URL-state search
  lib/
    auth.js                            # Helper baca user aktif
    client.js                          # Supabase browser client
    server.js                          # Supabase server client
    prisma.js                          # Prisma client + pg pool
    utils.js
  services/
    resi.js                            # Wrapper fetch API resi
    marketplace-resi.js                # Wrapper fetch API marketplace
  proxy.js                             # Proteksi route ala Next 16

prisma/
  schema.prisma                        # Skema database
  migrations/                         # Riwayat migrasi
  seed-cek-resi.js                    # Seed data uji cek resi
```

## Alur Halaman

### 1. Landing page

Route: `/`

Halaman publik ini merakit komponen:

- `LandingNavbar`
- `LandingHero`
- `LandingStats`
- `LandingFeatures`
- `LandingHowItWorks`
- `LandingMarketplaces`
- `LandingTestimonials`
- `LandingCTA`
- `LandingFooter`

Tujuannya murni presentasional dan mengarahkan user ke `/register` atau `/login`.

### 2. Auth

Routes:

- `/login`
- `/register`

Fitur auth:

- login email/password melalui `loginAction`
- register via `registerAction`
- logout via `logoutAction`
- validasi form dengan Zod
- redirect ke `/dashboard` setelah login berhasil

Komponen auth memakai Supabase SSR client dari `src/lib/server.js`.

### 3. Dashboard

Route: `/dashboard`

Dashboard mengambil data dari `GET /api/resi`, lalu menghitung:

- total resi,
- jumlah resi hari ini,
- jumlah resi 7 hari terakhir,
- jumlah resi bulan ini,
- tren 14 hari,
- distribusi marketplace,
- 10 resi terbaru.

UI dashboard dipisahkan ke `src/components/app/dashboard-ui.jsx`.

### 4. Tambah Resi

Route: `/tambah-resi`

Fitur aktif:

- input manual nomor resi internal,
- validasi server-side dengan Zod,
- status otomatis `Diterima`,
- normalisasi nomor resi ke huruf besar,
- penolakan duplikasi berdasarkan kombinasi `user_id + nomor_resi`.

Tab "Scanner Barcode" masih berupa placeholder UI.

### 5. Cek Resi

Route: `/cek-resi`

Fitur aktif:

- input marketplace manual,
- import CSV,
- preview CSV,
- perbandingan bertahap per chunk (`CHUNK_SIZE = 10`),
- progress bar saat proses verifikasi,
- hasil cocok, tidak cocok, dan tidak ditemukan,
- export hasil ke CSV,
- reset data marketplace.

Aturan pembandingan:

- hanya resi internal dengan status `Diterima` yang ikut dibandingkan,
- hanya data marketplace dengan status `Menunggu` yang diproses,
- hasil `cocok` akan:
  - mengubah resi internal menjadi `Selesai`,
  - menghapus item marketplace yang sudah cocok.

### 6. Daftar Resi

Route: `/daftar-resi`

Fitur aktif:

- 2 tab: resi internal dan resi marketplace,
- search dan filter berbasis query string,
- sorting tabel,
- pagination,
- optimistic delete,
- Suspense wrapper untuk `useSearchParams`.

Filter internal yang disimpan di URL:

- `q`
- `status`
- `mp`
- `dari`
- `sampai`

Filter marketplace yang disimpan di URL:

- `mpq`
- `mpstatus`
- `mpmp`

## Model Data

Skema Prisma final ada di `prisma/schema.prisma`.

### Enum `ResiStatus`

| Nilai | Arti |
|---|---|
| `Menunggu` | Resi marketplace sudah diinput tetapi belum selesai diverifikasi |
| `Diterima` | Resi internal sudah diterima toko dan siap dibandingkan |
| `Selesai` | Resi internal sudah lolos proses verifikasi |

### Model `Resi`

| Field | Tipe | Catatan |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Pemilik data |
| `nomor_resi` | String | Unik per user |
| `marketplace` | String | Nama marketplace |
| `kurir` | String | Nama kurir |
| `status` | `ResiStatus` | Default `Diterima` |
| `tanggal` | Date | Tanggal penerimaan |
| `nama_penerima` | String? | Opsional |
| `created_at` | Timestamptz | Otomatis |
| `updated_at` | Timestamptz | Otomatis |

Constraint penting:

- `@@unique([user_id, nomor_resi])`
- `@@index([user_id])`
- `@@index([status])`

### Model `MarketplaceResi`

| Field | Tipe | Catatan |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Pemilik data |
| `nomor_resi` | String | Unik per user |
| `marketplace` | String | Marketplace input |
| `status` | `ResiStatus` | Default `Menunggu` |
| `created_at` | Timestamptz | Otomatis |
| `updated_at` | Timestamptz | Otomatis |

Constraint penting:

- `@@unique([user_id, nomor_resi])`
- `@@index([user_id])`
- `@@index([status])`

## Auth dan Proteksi Route

Proteksi route menggunakan file `src/proxy.js`, sesuai pola Next.js 16.

Matcher aktif:

- `/dashboard/:path*`
- `/cek-resi/:path*`
- `/daftar-resi/:path*`
- `/tambah-resi/:path*`
- `/api/:path*`

Jika user belum punya session Supabase yang valid, request akan diarahkan ke `/login`.

## Server Actions dan API

### Server actions

| Lokasi | Fungsi |
|---|---|
| `src/app/(auth)/actions.js` | login, register, logout |
| `src/app/(app)/tambah-resi/actions.js` | buat resi internal |
| `src/app/(app)/cek-resi/actions.js` | buat resi marketplace secara manual |

### API yang saat ini tersedia

| Method | Route | Fungsi |
|---|---|---|
| `GET` | `/api/resi` | Ambil seluruh resi internal milik user |
| `DELETE` | `/api/resi/[id]` | Hapus satu resi internal |
| `PATCH` | `/api/resi/[id]` | Ubah status resi internal |
| `GET` | `/api/marketplace-resi` | Ambil seluruh resi marketplace milik user |
| `DELETE` | `/api/marketplace-resi` | Hapus seluruh resi marketplace milik user |
| `DELETE` | `/api/marketplace-resi/[id]` | Hapus satu resi marketplace |

## Setup Lokal

### Prasyarat

- Node.js `>= 20.9.0`
- npm
- akses ke project Supabase yang menyediakan:
  - Auth
  - PostgreSQL

### Environment variables

Buat `.env.local` dengan variabel berikut:

```bash
DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""
```

Catatan:

- `DATABASE_URL` dipakai runtime Prisma melalui `src/lib/prisma.js`.
- `DIRECT_URL` dipakai Prisma CLI melalui `prisma.config.ts`.
- file `.env` juga ada di workspace, tetapi untuk development local sebaiknya sumber utama tetap `.env.local`.

### Instalasi

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Lalu buka:

```text
http://localhost:3000
```

## Script yang Tersedia

| Script | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Menjalankan ESLint |
| `npm run seed:cek-resi` | Menambahkan dataset uji untuk halaman cek resi |

## Seed Data Uji

Script `npm run seed:cek-resi` akan membuat:

- 50 data `resi` internal dengan status `Diterima`
- 50 data `marketplace_resi` dengan status `Menunggu`
- distribusi hasil verifikasi kira-kira:
  - 20 cocok
  - 20 tidak cocok
  - 10 tidak ditemukan

Penting:

- script berada di `prisma/seed-cek-resi.js`
- script memuat env dari `.env.local`
- script memakai `USER_ID` hardcoded

Jika data hasil seed tidak muncul di aplikasi, biasanya penyebabnya adalah `USER_ID` di script seed tidak sama dengan `sub` user Supabase yang dipakai untuk login. Ubah nilai `USER_ID` terlebih dahulu agar data uji masuk ke akun yang benar.

## Catatan Implementasi Saat Ini

Beberapa bagian workspace sudah stabil, tetapi ada gap yang perlu diketahui:

- `src/services/resi.js` memiliki helper `addResi()`, tetapi route `POST /api/resi` belum ada.
- `src/services/marketplace-resi.js` memiliki helper `addMarketplaceResi()`, tetapi route `POST /api/marketplace-resi` belum ada.
- input manual marketplace di `/cek-resi` tetap bekerja karena memakai server action `addMarketplaceResiAction`.
- import CSV di `/cek-resi` saat ini mengandalkan `addMarketplaceResi()` dari service client, sehingga secara implementasi sekarang berisiko gagal sampai route `POST /api/marketplace-resi` ditambahkan atau alur import dipindah ke server action.
- belum ada test otomatis; quality gate yang tersedia saat ini adalah linting.

## Referensi File Penting

| Topik | File |
|---|---|
| Root layout | `src/app/layout.js` |
| Proteksi route | `src/proxy.js` |
| Prisma client | `src/lib/prisma.js` |
| Supabase server client | `src/lib/server.js` |
| Helper user aktif | `src/lib/auth.js` |
| Schema database | `prisma/schema.prisma` |
| Seed data uji | `prisma/seed-cek-resi.js` |
| Dashboard | `src/app/(app)/dashboard/page.js` |
| Tambah resi | `src/app/(app)/tambah-resi/page.js` |
| Cek resi | `src/app/(app)/cek-resi/page.js` |
| Daftar resi | `src/app/(app)/daftar-resi/page.js` |

## Status Singkat

Secara umum, workspace ini sudah memiliki fondasi produk yang jelas:

- auth aktif,
- proteksi route aktif,
- model data Prisma aktif,
- dashboard, tambah resi, cek resi, dan daftar resi sudah tersedia,
- UX App Router seperti loading, error, optimistic UI, dan URL as state sudah mulai diterapkan.

Fokus perbaikan berikutnya paling masuk akal adalah merapikan konsistensi layer API vs server action, terutama pada alur import CSV marketplace.
