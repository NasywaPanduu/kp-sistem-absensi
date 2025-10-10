# Sistem Absensi Siswa Berbasis Web

Aplikasi web untuk mengelola absensi siswa di SDN 2 Sojokerto yang dibangun dengan React, TypeScript, dan Tailwind CSS.

## 🚀 Fitur Utama

### 👨‍💼 Dashboard Admin
- **Manajemen Data Siswa** - CRUD siswa dengan informasi lengkap
- **Manajemen Data Guru** - CRUD guru dengan akun login otomatis
- **Manajemen Kelas** - CRUD kelas dengan tingkat dan tahun ajaran
- **Manajemen Mata Pelajaran** - CRUD mata pelajaran
- **Laporan Absensi** - Export PDF (harian, bulanan, custom filter)
- **Statistik Dashboard** - Overview data sekolah

### 👨‍🏫 Dashboard Guru
- **Input Absensi** - Form absensi per kelas dengan status lengkap
- **Riwayat Absensi** - Melihat riwayat absensi dengan filter
- **Statistik Kelas** - Data siswa per kelas yang diajar

### 🔐 Sistem Autentikasi
- Login terpisah untuk Admin dan Guru
- Session management dengan localStorage
- Demo credentials tersedia

### 📱 Responsive Design
- Mobile-first approach
- Glass morphism effects
- Modern UI/UX dengan Tailwind CSS

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Build Tool**: Vite
- **Storage**: localStorage (untuk demo)

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd sistem-absensi-siswa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Build untuk production**
   ```bash
   npm run build
   ```

## 🔑 Demo Credentials

### Admin
- **Email**: admin@sekolah.edu
- **Password**: admin123

### Guru
- **Email**: budi.santoso@sekolah.edu
- **Password**: guru123
- **Email**: siti.rahma@sekolah.edu
- **Password**: guru123
- **Email**: ahmad.wijaya@sekolah.edu
- **Password**: guru123

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── StudentManagement.tsx
│   │   ├── TeacherManagement.tsx
│   │   ├── ClassManagement.tsx
│   │   ├── SubjectManagement.tsx
│   │   └── AttendanceReport.tsx
│   ├── teacher/
│   │   ├── TeacherDashboard.tsx
│   │   ├── AttendanceForm.tsx
│   │   └── AttendanceHistory.tsx
│   ├── Layout.tsx
│   └── LoginForm.tsx
├── data/
│   └── initialData.ts
├── types/
│   └── index.ts
├── utils/
│   └── storage.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🎯 Cara Penggunaan

### Untuk Admin:
1. Login dengan akun admin
2. Kelola data siswa, guru, kelas, dan mata pelajaran
3. Lihat laporan absensi dan export ke PDF
4. Monitor statistik sekolah di dashboard

### Untuk Guru:
1. Login dengan akun guru
2. Input absensi siswa per kelas yang diajar
3. Lihat riwayat absensi dengan filter
4. Monitor statistik kelas di dashboard

## 📊 Export PDF

Aplikasi mendukung 3 jenis export PDF:
- **Harian**: Data absensi hari ini
- **Bulanan**: Data absensi bulan berjalan
- **Custom**: Data sesuai filter tanggal dan kelas

## 🔧 Kustomisasi

### Menambah Kelas Baru
Edit file `src/data/initialData.ts` pada array `initialClasses`

### Menambah Mata Pelajaran
Edit file `src/data/initialData.ts` pada array `initialSubjects`

### Mengubah Logo Sekolah
Ganti file logo di folder `public/` dan update path di komponen Layout dan LoginForm

## 📝 Lisensi

Aplikasi ini dibuat untuk keperluan pendidikan dan dapat digunakan secara bebas.

## 👨‍💻 Developer

Dikembangkan untuk SDN 2 Sojokerto, Kec. Leksono, Kab. Wonosobo

---

**Catatan**: Aplikasi ini menggunakan localStorage untuk penyimpanan data demo. Untuk production, disarankan menggunakan database yang sesuai.