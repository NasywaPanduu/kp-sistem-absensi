export interface User {
  id: string;
  email: string;
  password: string;
  role: 'admin' | 'guru';
  name: string;
}

export interface Teacher {
  id: string;
  nip: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Class {
  id: string;
  name: string;
  level: string;
  major: string;
  academicYear: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  classId: string;
  gender: 'L' | 'P';
  email?: string;
  phone?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alpha';
  note?: string;
  teacherId: string;
  subjectId?: string;
}

export interface AttendanceRecord extends Attendance {
  student: Student;
  teacher?: Teacher;
  subject?: Subject;
  class?: Class;
}