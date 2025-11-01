import React, { useState, useEffect } from 'react';
import { Save, Calendar, Users, CheckCircle } from 'lucide-react';
import { Student, Attendance, Class } from '../../types';
import { storage } from '../../utils/storage';

interface AttendanceFormProps {
  students: Student[];
  attendances: Attendance[];
  teacherId: string;
  onAttendanceChange: (attendances: Attendance[]) => void;
}

export const AttendanceForm: React.FC<AttendanceFormProps> = ({
  students,
  attendances,
  teacherId,
  onAttendanceChange
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; note: string }>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    setClasses(storage.getClasses());
  }, []);

  const getStudentClass = (student: Student): Class | undefined => {
    return classes.find(c => c.id === student.classId);
  };

  useEffect(() => {
    if (selectedClass) {
      const existingAttendances = attendances.filter(
        a => a.date === selectedDate && 
        students.find(s => s.id === a.studentId && s.classId === selectedClass)
      );

      const data: Record<string, { status: string; note: string }> = {};
      existingAttendances.forEach(attendance => {
        data[attendance.studentId] = {
          status: attendance.status,
          note: attendance.note || ''
        };
      });

      setAttendanceData(data);
    }
  }, [selectedDate, selectedClass, attendances, students]);

  const filteredStudents = students.filter(s => 
    selectedClass ? s.classId === selectedClass : true
  ).sort((a, b) => a.name.localeCompare(b.name));

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedClass) {
      alert('Silakan pilih kelas terlebih dahulu');
      return;
    }

    setIsSaving(true);

    try {
      // Remove existing attendances for the selected date and class
      const filteredAttendances = attendances.filter(a => {
        const student = students.find(s => s.id === a.studentId);
        return !(a.date === selectedDate && student?.classId === selectedClass);
      });

      // Add new attendances
      const newAttendances: Attendance[] = [];
      Object.entries(attendanceData).forEach(([studentId, data]) => {
        if (data.status) {
          newAttendances.push({
            id: `${selectedDate}-${studentId}-${Date.now()}`,
            studentId,
            date: selectedDate,
            status: data.status as 'hadir' | 'sakit' | 'izin' | 'alpha',
            note: data.note,
            teacherId
          });
        }
      });

      const updatedAttendances = [...filteredAttendances, ...newAttendances];
      onAttendanceChange(updatedAttendances);
      storage.saveAttendances(updatedAttendances);

      alert('Data absensi berhasil disimpan!');
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setIsSaving(false);
    }
  };

  const getAttendanceCounts = () => {
    const counts = { hadir: 0, sakit: 0, izin: 0, alpha: 0 };
    Object.values(attendanceData).forEach(data => {
      if (data.status && counts.hasOwnProperty(data.status)) {
        counts[data.status as keyof typeof counts]++;
      }
    });
    return counts;
  };

  const counts = getAttendanceCounts();

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Input Absensi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kelas
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Pilih Kelas</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{counts.hadir}</div>
              <div className="text-sm text-green-700">Hadir</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{counts.sakit}</div>
              <div className="text-sm text-yellow-700">Sakit</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{counts.izin}</div>
              <div className="text-sm text-blue-700">Izin</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-600">{counts.alpha}</div>
              <div className="text-sm text-red-700">Alpha</div>
            </div>
          </div>
        )}
      </div>

      {/* Student List */}
      {selectedClass && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">
                Daftar Siswa {classes.find(c => c.id === selectedClass)?.name} ({filteredStudents.length} siswa)
              </h3>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <div key={student.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-500">NIS: {student.nis}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {[
                    { value: 'hadir', label: 'Hadir', color: 'green' },
                    { value: 'sakit', label: 'Sakit', color: 'yellow' },
                    { value: 'izin', label: 'Izin', color: 'blue' },
                    { value: 'alpha', label: 'Alpha', color: 'red' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${
                        attendanceData[student.id]?.status === option.value
                          ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value={option.value}
                        checked={attendanceData[student.id]?.status === option.value}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                </div>

                {(attendanceData[student.id]?.status === 'sakit' || 
                  attendanceData[student.id]?.status === 'izin') && (
                  <textarea
                    placeholder="Keterangan (opsional)"
                    value={attendanceData[student.id]?.note || ''}
                    onChange={(e) => handleNoteChange(student.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    rows={2}
                  />
                )}
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Tidak ada siswa di kelas ini</p>
            </div>
          )}
        </div>
      )}

      {!selectedClass && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Pilih kelas untuk mulai mengisi absensi</p>
        </div>
      )}
    </div>
  );
};