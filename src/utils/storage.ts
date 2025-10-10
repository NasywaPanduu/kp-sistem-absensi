import { User, Student, Attendance, Teacher, Subject, Class } from '../types';
import { initialUsers, initialStudents, initialTeachers, initialSubjects, initialClasses } from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'attendance_users',
  STUDENTS: 'attendance_students',
  TEACHERS: 'attendance_teachers',
  SUBJECTS: 'attendance_subjects',
  CLASSES: 'attendance_classes',
  ATTENDANCES: 'attendance_records',
  CURRENT_USER: 'current_user'
};

export const storage = {
  // Users
  getUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default users and sync with teachers
      const users = [...initialUsers];
      const teachers = initialTeachers;
      
      // Ensure all teachers have corresponding user accounts
      teachers.forEach(teacher => {
        const existingUser = users.find(u => u.email === teacher.email);
        if (!existingUser) {
          users.push({
            id: (Date.now() + Math.random()).toString(),
            email: teacher.email,
            password: 'guru123', // Default password for demo
            role: 'guru',
            name: teacher.name
          });
        }
      });
      
      // Save the synchronized users
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return users;
    }
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Students
  getStudents: (): Student[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return stored ? JSON.parse(stored) : initialStudents;
  },

  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  // Teachers
  getTeachers: (): Teacher[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return stored ? JSON.parse(stored) : initialTeachers;
  },

  saveTeachers: (teachers: Teacher[]) => {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  // Subjects
  getSubjects: (): Subject[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return stored ? JSON.parse(stored) : initialSubjects;
  },

  saveSubjects: (subjects: Subject[]) => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  // Classes
  getClasses: (): Class[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return stored ? JSON.parse(stored) : initialClasses;
  },

  saveClasses: (classes: Class[]) => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  // Attendances
  getAttendances: (): Attendance[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCES);
    return stored ? JSON.parse(stored) : [];
  },

  saveAttendances: (attendances: Attendance[]) => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCES, JSON.stringify(attendances));
  },

  // Current User
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
};