import React, { useState, useEffect } from 'react';
import { User, Student, Teacher, Class, Subject, Attendance } from '../../types';
import { storage } from '../../utils/storage';
import { StudentManagement } from './StudentManagement';
import { TeacherManagement } from './TeacherManagement';
import { ClassManagement } from './ClassManagement';
import { SubjectManagement } from './SubjectManagement';
import { AttendanceReport } from './AttendanceReport';
import { Users, GraduationCap, BookOpen, Building, FileText, Activity } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  useEffect(() => {
    setStudents(storage.getStudents());
    setTeachers(storage.getTeachers());
    setClasses(storage.getClasses());
    setSubjects(storage.getSubjects());
    setAttendances(storage.getAttendances());
  }, []);

  const handleStudentsChange = (newStudents: Student[]) => {
    setStudents(newStudents);
    storage.saveStudents(newStudents);
  };

  const handleTeachersChange = (newTeachers: Teacher[]) => {
    setTeachers(newTeachers);
    storage.saveTeachers(newTeachers);
  };

  const handleClassesChange = (newClasses: Class[]) => {
    setClasses(newClasses);
    storage.saveClasses(newClasses);
  };

  const handleSubjectsChange = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    storage.saveSubjects(newSubjects);
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendances.filter(a => a.date === today);
  };

  const getAttendanceStats = () => {
    const todayAttendance = getTodayAttendance();
    const total = todayAttendance.length;
    const present = todayAttendance.filter(a => a.status === 'hadir').length;
    const sick = todayAttendance.filter(a => a.status === 'sakit').length;
    const permission = todayAttendance.filter(a => a.status === 'izin').length;
    const absent = todayAttendance.filter(a => a.status === 'alpha').length;

    return { total, present, sick, permission, absent };
  };

  const stats = getAttendanceStats();

  const renderDashboard = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Siswa</p>
              <p className="text-3xl font-bold text-gray-900">{students.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Guru</p>
              <p className="text-3xl font-bold text-gray-900">{teachers.length}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Total Kelas</p>
              <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Building className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Mata Pelajaran</p>
              <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-500" />
            Statistik Absensi Hari Ini
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Total Absensi</span>
              <span className="font-bold text-lg">{stats.total}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-600">Hadir</span>
              <span className="font-bold text-lg text-green-600">{stats.present}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-600">Sakit</span>
              <span className="font-bold text-lg text-yellow-600">{stats.sick}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Izin</span>
              <span className="font-bold text-lg text-blue-600">{stats.permission}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-600">Alpha</span>
              <span className="font-bold text-lg text-red-600">{stats.absent}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-6">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            {students.slice(0, 5).map((student) => {
              const studentClass = classes.find(c => c.id === student.classId);
              return (
                <div key={student.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-600">
                      {studentClass ? studentClass.name : 'Kelas tidak ditemukan'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'students', label: 'Siswa', icon: Users },
    { id: 'teachers', label: 'Guru', icon: GraduationCap },
    { id: 'classes', label: 'Kelas', icon: Building },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'attendance', label: 'Laporan Absensi', icon: FileText },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-gray-200/50">
        <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 mt-2 text-lg">Selamat datang, {user.name}</p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <nav className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-6 font-medium text-sm transition-all duration-200 whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            classes={classes}
            onStudentsChange={handleStudentsChange}
          />
        )}
        {activeTab === 'teachers' && (
          <TeacherManagement
            teachers={teachers}
            onTeachersChange={handleTeachersChange}
          />
        )}
        {activeTab === 'classes' && (
          <ClassManagement
            classes={classes}
            onClassesChange={handleClassesChange}
          />
        )}
        {activeTab === 'subjects' && (
          <SubjectManagement
            subjects={subjects}
            onSubjectsChange={handleSubjectsChange}
          />
        )}
        {activeTab === 'attendance' && (
          <AttendanceReport
            students={students}
            classes={classes}
            attendances={attendances}
          />
        )}
      </div>
    </div>
  );
};