import { User, Student, Teacher, Subject, Class } from '../types';

export const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@sekolah.edu',
    password: 'admin123',
    role: 'admin',
    name: 'Administrator'
  },
  {
    id: '2',
    email: 'budi.santoso@sekolah.edu',
    password: 'guru123',
    role: 'guru',
    name: 'Budi Santoso'
  },
  {
    id: '3',
    email: 'siti.rahma@sekolah.edu',
    password: 'guru123',
    role: 'guru',
    name: 'Siti Rahma'
  },
  {
    id: '4',
    email: 'ahmad.wijaya@sekolah.edu',
    password: 'guru123',
    role: 'guru',
    name: 'Ahmad Wijaya'
  }
];

export const initialTeachers: Teacher[] = [
  {
    id: '1',
    nip: '196801011990031001',
    name: 'Budi Santoso',
    email: 'budi.santoso@sekolah.edu',
    phone: '081234567890',
    subject: 'Guru Kelas 1'
  },
  {
    id: '2',
    nip: '197205151995122002',
    name: 'Siti Rahma',
    email: 'siti.rahma@sekolah.edu',
    phone: '081234567891',
    subject: 'Guru Kelas 2'
  },
  {
    id: '3',
    nip: '198003201998031003',
    name: 'Ahmad Wijaya',
    email: 'ahmad.wijaya@sekolah.edu',
    phone: '081234567892',
    subject: 'Guru Kelas 3'
  }
];

export const initialSubjects: Subject[] = [
  { id: '1', code: 'MAT', name: 'Matematika', description: 'Mata pelajaran Matematika untuk SD' },
  { id: '2', code: 'BIN', name: 'Bahasa Indonesia', description: 'Mata pelajaran Bahasa Indonesia untuk SD' },
  { id: '3', code: 'IPA', name: 'Ilmu Pengetahuan Alam', description: 'Mata pelajaran IPA untuk SD' },
  { id: '4', code: 'IPS', name: 'Ilmu Pengetahuan Sosial', description: 'Mata pelajaran IPS untuk SD' },
  { id: '5', code: 'PKN', name: 'Pendidikan Kewarganegaraan', description: 'Mata pelajaran PKN untuk SD' },
  { id: '6', code: 'SBK', name: 'Seni Budaya dan Kerajinan', description: 'Mata pelajaran SBK untuk SD' },
  { id: '7', code: 'PJK', name: 'Pendidikan Jasmani dan Kesehatan', description: 'Mata pelajaran Penjas untuk SD' },
  { id: '8', code: 'PAI', name: 'Pendidikan Agama Islam', description: 'Mata pelajaran Agama Islam untuk SD' },
  { id: '9', code: 'BIG', name: 'Bahasa Inggris', description: 'Mata pelajaran Bahasa Inggris untuk SD' },
  { id: '10', code: 'MLK', name: 'Muatan Lokal', description: 'Mata pelajaran Muatan Lokal untuk SD' }
];

export const initialClasses: Class[] = [
  { id: '1', name: 'Kelas 1', level: '1', major: '', academicYear: '2024/2025' },
  { id: '2', name: 'Kelas 2', level: '2', major: '', academicYear: '2024/2025' },
  { id: '3', name: 'Kelas 3', level: '3', major: '', academicYear: '2024/2025' },
  { id: '4', name: 'Kelas 4', level: '4', major: '', academicYear: '2024/2025' },
  { id: '5', name: 'Kelas 5', level: '5', major: '', academicYear: '2024/2025' },
  { id: '6', name: 'Kelas 6', level: '6', major: '', academicYear: '2024/2025' }
];

export const initialStudents: Student[] = [
  { id: '1', nis: '2024001', name: 'Ahmad Rizki', classId: '1', gender: 'L', email: 'ahmad.rizki@student.edu', phone: '081234567801' },
  { id: '2', nis: '2024002', name: 'Sari Indah', classId: '1', gender: 'P', email: 'sari.indah@student.edu', phone: '081234567802' },
  { id: '3', nis: '2024003', name: 'Budi Hartono', classId: '2', gender: 'L', email: 'budi.hartono@student.edu', phone: '081234567803' },
  { id: '4', nis: '2024004', name: 'Maya Sari', classId: '2', gender: 'P', email: 'maya.sari@student.edu', phone: '081234567804' },
  { id: '5', nis: '2024005', name: 'Dian Pratama', classId: '3', gender: 'L', email: 'dian.pratama@student.edu', phone: '081234567805' },
  { id: '6', nis: '2024006', name: 'Rina Wati', classId: '3', gender: 'P', email: 'rina.wati@student.edu', phone: '081234567806' },
  { id: '7', nis: '2024007', name: 'Andi Setiawan', classId: '4', gender: 'L', email: 'andi.setiawan@student.edu', phone: '081234567807' },
  { id: '8', nis: '2024008', name: 'Dewi Lestari', classId: '4', gender: 'P', email: 'dewi.lestari@student.edu', phone: '081234567808' },
  { id: '9', nis: '2024009', name: 'Fajar Ramadhan', classId: '5', gender: 'L', email: 'fajar.ramadhan@student.edu', phone: '081234567809' },
  { id: '10', nis: '2024010', name: 'Indira Putri', classId: '5', gender: 'P', email: 'indira.putri@student.edu', phone: '081234567810' },
  { id: '11', nis: '2024011', name: 'Galih Pratama', classId: '6', gender: 'L', email: 'galih.pratama@student.edu', phone: '081234567811' },
  { id: '12', nis: '2024012', name: 'Hana Safitri', classId: '6', gender: 'P', email: 'hana.safitri@student.edu', phone: '081234567812' }
];