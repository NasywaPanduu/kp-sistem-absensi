import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import { Student, User, Attendance, Teacher, Class } from '../../types';
import { storage } from '../../utils/storage';
import { AttendanceForm } from './AttendanceForm';
import { AttendanceHistory } from './AttendanceHistory';

interface TeacherDashboardProps {
  user: User;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    setStudents(storage.getStudents());
    setAttendances(storage.getAttendances());
    setTeachers(storage.getTeachers());
    setClasses(storage.getClasses());
  }, []);

  // Get current teacher data
  const currentTeacher = teachers.find(t => t.email === user.email);
  
  // Get class taught by this teacher
  const getTeacherClass = () => {
    if (!currentTeacher) return null;
    
    // Extract class number from teacher subject (e.g., "Guru Kelas 1" -> "1")
    const classMatch = currentTeacher.subject.match(/Guru Kelas (\d+)/);
    if (classMatch) {
      const classLevel = classMatch[1];
      return classes.find(c => c.level === classLevel);
    }
    return null;
  };

  const teacherClass = getTeacherClass();
  
  // Filter students by teacher's class
  const classStudents = teacherClass 
    ? students.filter(s => s.classId === teacherClass.id)
    : students; // Show all students if teacher doesn't have specific class

  const today = new Date().toISOString().split('T')[0];
  const todayAttendances = attendances.filter(a => {
    const student = students.find(s => s.id === a.studentId);
    return a.date === today && 
           a.teacherId === user.id &&
           (teacherClass ? student?.classId === teacherClass.id : true);
  });

  const tabs = [
    { id: 'attendance', label: 'Input Absensi', icon: CheckCircle },
    { id: 'history', label: 'Riwayat', icon: Clock }
  ];

  const stats = [
    { 
      title: teacherClass ? `Total Siswa ${teacherClass.name}` : 'Total Siswa', 
      value: classStudents.length, 
      color: 'blue', 
      icon: Users 
    },
    { title: 'Sudah Absen', value: todayAttendances.length, color: 'green', icon: CheckCircle },
    { title: 'Belum Absen', value: classStudents.length - todayAttendances.length, color: 'orange', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
        <p className="text-gray-600">Selamat datang, {user.name}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-500 text-blue-600 bg-blue-50',
            green: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
            orange: 'bg-amber-500 text-amber-600 bg-amber-50'
          };

          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[2]}`}>
                  <Icon className={`w-6 h-6 ${colorClasses[stat.color as keyof typeof colorClasses].split(' ')[1]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      {activeTab === 'attendance' && (
        <AttendanceForm
          students={classStudents}
          attendances={attendances}
          teacherId={user.id}
          onAttendanceChange={setAttendances}
        />
      )}

      {activeTab === 'history' && (
        <AttendanceHistory
          students={classStudents}
          attendances={attendances.filter(a => a.teacherId === user.id)}
        />
      )}
    </div>
  );
};