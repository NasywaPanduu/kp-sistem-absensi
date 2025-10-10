import React, { useState } from 'react';
import { Calendar, FileText, Filter, Users } from 'lucide-react';
import { Student, Attendance, AttendanceRecord, Class } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AttendanceReportProps {
  students: Student[];
  classes: Class[];
  attendances: Attendance[];
}

export const AttendanceReport: React.FC<AttendanceReportProps> = ({ 
  students, 
  classes,
  attendances 
}) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const getStudentClass = (student: Student): Class | undefined => {
    return classes.find(c => c.id === student.classId);
  };

  const getFilteredRecords = (): AttendanceRecord[] => {
    let filtered = attendances.map(attendance => ({
      ...attendance,
      student: students.find(s => s.id === attendance.studentId)!,
      class: getStudentClass(students.find(s => s.id === attendance.studentId)!)
    })).filter(record => record.student);

    if (dateFrom) {
      filtered = filtered.filter(record => record.date >= dateFrom);
    }
    if (dateTo) {
      filtered = filtered.filter(record => record.date <= dateTo);
    }
    if (selectedClass) {
      filtered = filtered.filter(record => record.class?.id === selectedClass);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getAttendanceStats = () => {
    const filtered = getFilteredRecords();
    const totalRecords = filtered.length;
    
    return {
      total: totalRecords,
      present: filtered.filter(r => r.status === 'hadir').length,
      sick: filtered.filter(r => r.status === 'sakit').length,
      permit: filtered.filter(r => r.status === 'izin').length,
      absent: filtered.filter(r => r.status === 'alpha').length
    };
  };

  const getMonthlyStats = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRecords = attendances.filter(attendance => {
      const student = students.find(s => s.id === attendance.studentId);
      const studentClass = student ? getStudentClass(student) : null;
      
      return attendance.date.startsWith(currentMonth) &&
             (selectedClass ? studentClass?.id === selectedClass : true);
    });

    return {
      total: monthlyRecords.length,
      present: monthlyRecords.filter(r => r.status === 'hadir').length,
      sick: monthlyRecords.filter(r => r.status === 'sakit').length,
      permit: monthlyRecords.filter(r => r.status === 'izin').length,
      absent: monthlyRecords.filter(r => r.status === 'alpha').length
    };
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendances.filter(attendance => {
      const student = students.find(s => s.id === attendance.studentId);
      const studentClass = student ? getStudentClass(student) : null;
      
      return attendance.date === today &&
             (selectedClass ? studentClass?.id === selectedClass : true);
    });

    return {
      total: todayRecords.length,
      present: todayRecords.filter(r => r.status === 'hadir').length,
      sick: todayRecords.filter(r => r.status === 'sakit').length,
      permit: todayRecords.filter(r => r.status === 'izin').length,
      absent: todayRecords.filter(r => r.status === 'alpha').length
    };
  };
  const stats = getAttendanceStats();
  const filteredRecords = getFilteredRecords();

  const getStatusBadge = (status: string) => {
    const badges = {
      hadir: 'bg-green-100 text-green-800',
      sakit: 'bg-yellow-100 text-yellow-800',
      izin: 'bg-blue-100 text-blue-800',
      alpha: 'bg-red-100 text-red-800'
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const exportDailyPDF = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendances.filter(attendance => {
      const student = students.find(s => s.id === attendance.studentId);
      const studentClass = student ? getStudentClass(student) : null;
      
      return attendance.date === today &&
             (selectedClass ? studentClass?.id === selectedClass : true);
    }).map(attendance => ({
      ...attendance,
      student: students.find(s => s.id === attendance.studentId)!,
      class: getStudentClass(students.find(s => s.id === attendance.studentId)!)
    })).filter(record => record.student);

    const todayStats = getTodayStats();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN ABSENSI HARIAN', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SDN 2 SOJOKERTO', 105, 30, { align: 'center' });
    
    // Date info
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date(today).toLocaleDateString('id-ID')}`, 14, 45);
    
    if (selectedClass) {
      const className = classes.find(c => c.id === selectedClass)?.name;
      doc.text(`Kelas: ${className}`, 14, 53);
    } else {
      doc.text('Kelas: Semua kelas', 14, 53);
    }
    
    // Statistics
    const statsY = 65;
    doc.setFont('helvetica', 'bold');
    doc.text('RINGKASAN HARI INI:', 14, statsY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${todayStats.total}`, 14, statsY + 8);
    doc.text(`Hadir: ${todayStats.present}`, 50, statsY + 8);
    doc.text(`Sakit: ${todayStats.sick}`, 86, statsY + 8);
    doc.text(`Izin: ${todayStats.permit}`, 122, statsY + 8);
    doc.text(`Alpha: ${todayStats.absent}`, 158, statsY + 8);
    
    // Table
    const tableData = todayRecords.map(record => [
      record.student.nis,
      record.student.name,
      record.class?.name || 'Kelas tidak ditemukan',
      record.status.charAt(0).toUpperCase() + record.status.slice(1),
      record.note || '-'
    ]);
    
    autoTable(doc, {
      head: [['NIS', 'Nama', 'Kelas', 'Status', 'Keterangan']],
      body: tableData,
      startY: statsY + 20,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 25 },
        4: { cellWidth: 40 },
      },
      didParseCell: function(data) {
        if (data.column.index === 3 && data.section === 'body') {
          const status = data.cell.text[0].toLowerCase();
          switch(status) {
            case 'hadir':
              data.cell.styles.textColor = [34, 197, 94];
              break;
            case 'sakit':
              data.cell.styles.textColor = [245, 158, 11];
              break;
            case 'izin':
              data.cell.styles.textColor = [59, 130, 246];
              break;
            case 'alpha':
              data.cell.styles.textColor = [239, 68, 68];
              break;
          }
        }
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    const fileName = `laporan-absensi-harian-${today}.pdf`;
    doc.save(fileName);
  };

  const exportMonthlyPDF = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyRecords = attendances.filter(attendance => {
      const student = students.find(s => s.id === attendance.studentId);
      const studentClass = student ? getStudentClass(student) : null;
      
      return attendance.date.startsWith(currentMonth) &&
             (selectedClass ? studentClass?.id === selectedClass : true);
    }).map(attendance => ({
      ...attendance,
      student: students.find(s => s.id === attendance.studentId)!,
      class: getStudentClass(students.find(s => s.id === attendance.studentId)!)
    })).filter(record => record.student)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const monthlyStats = getMonthlyStats();
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN ABSENSI BULANAN', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SDN 2 SOJOKERTO', 105, 30, { align: 'center' });
    
    // Month info
    const monthName = new Date(currentMonth + '-01').toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long' 
    });
    doc.setFontSize(10);
    doc.text(`Bulan: ${monthName}`, 14, 45);
    
    if (selectedClass) {
      const className = classes.find(c => c.id === selectedClass)?.name;
      doc.text(`Kelas: ${className}`, 14, 53);
    } else {
      doc.text('Kelas: Semua kelas', 14, 53);
    }
    
    // Statistics
    const statsY = 65;
    doc.setFont('helvetica', 'bold');
    doc.text('RINGKASAN BULAN INI:', 14, statsY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${monthlyStats.total}`, 14, statsY + 8);
    doc.text(`Hadir: ${monthlyStats.present}`, 50, statsY + 8);
    doc.text(`Sakit: ${monthlyStats.sick}`, 86, statsY + 8);
    doc.text(`Izin: ${monthlyStats.permit}`, 122, statsY + 8);
    doc.text(`Alpha: ${monthlyStats.absent}`, 158, statsY + 8);
    
    // Table
    const tableData = monthlyRecords.map(record => [
      new Date(record.date).toLocaleDateString('id-ID'),
      record.student.nis,
      record.student.name,
      record.class?.name || 'Kelas tidak ditemukan',
      record.status.charAt(0).toUpperCase() + record.status.slice(1),
      record.note || '-'
    ]);
    
    autoTable(doc, {
      head: [['Tanggal', 'NIS', 'Nama', 'Kelas', 'Status', 'Keterangan']],
      body: tableData,
      startY: statsY + 20,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 35 },
      },
      didParseCell: function(data) {
        if (data.column.index === 4 && data.section === 'body') {
          const status = data.cell.text[0].toLowerCase();
          switch(status) {
            case 'hadir':
              data.cell.styles.textColor = [34, 197, 94];
              break;
            case 'sakit':
              data.cell.styles.textColor = [245, 158, 11];
              break;
            case 'izin':
              data.cell.styles.textColor = [59, 130, 246];
              break;
            case 'alpha':
              data.cell.styles.textColor = [239, 68, 68];
              break;
          }
        }
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    const fileName = `laporan-absensi-bulanan-${currentMonth}.pdf`;
    doc.save(fileName);
  };

  const exportFilteredPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('LAPORAN ABSENSI SISWA', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('SDN 2 SOJOKERTO', 105, 30, { align: 'center' });
    
    // Filter info
    let filterText = 'Filter: ';
    if (dateFrom && dateTo) {
      filterText += `${dateFrom} s/d ${dateTo}`;
    } else if (dateFrom) {
      filterText += `Dari ${dateFrom}`;
    } else if (dateTo) {
      filterText += `Sampai ${dateTo}`;
    } else {
      filterText += 'Semua tanggal';
    }
    
    if (selectedClass) {
      const className = classes.find(c => c.id === selectedClass)?.name;
      filterText += ` | Kelas: ${className}`;
    } else {
      filterText += ' | Semua kelas';
    }
    
    doc.setFontSize(10);
    doc.text(filterText, 14, 45);
    
    // Statistics
    const statsY = 55;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RINGKASAN:', 14, statsY);
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Total: ${stats.total}`, 14, statsY + 8);
    doc.text(`Hadir: ${stats.present}`, 50, statsY + 8);
    doc.text(`Sakit: ${stats.sick}`, 86, statsY + 8);
    doc.text(`Izin: ${stats.permit}`, 122, statsY + 8);
    doc.text(`Alpha: ${stats.absent}`, 158, statsY + 8);
    
    // Table
    const tableData = filteredRecords.map(record => [
      new Date(record.date).toLocaleDateString('id-ID'),
      record.student.nis,
      record.student.name,
      record.class?.name || 'Kelas tidak ditemukan',
      record.status.charAt(0).toUpperCase() + record.status.slice(1),
      record.note || '-'
    ]);
    
    autoTable(doc, {
      head: [['Tanggal', 'NIS', 'Nama', 'Kelas', 'Status', 'Keterangan']],
      body: tableData,
      startY: statsY + 20,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // Light gray
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Tanggal
        1: { cellWidth: 20 }, // NIS
        2: { cellWidth: 40 }, // Nama
        3: { cellWidth: 25 }, // Kelas
        4: { cellWidth: 20 }, // Status
        5: { cellWidth: 40 }, // Keterangan
      },
      didParseCell: function(data) {
        // Color coding for status
        if (data.column.index === 4 && data.section === 'body') {
          const status = data.cell.text[0].toLowerCase();
          switch(status) {
            case 'hadir':
              data.cell.styles.textColor = [34, 197, 94]; // Green
              break;
            case 'sakit':
              data.cell.styles.textColor = [245, 158, 11]; // Yellow
              break;
            case 'izin':
              data.cell.styles.textColor = [59, 130, 246]; // Blue
              break;
            case 'alpha':
              data.cell.styles.textColor = [239, 68, 68]; // Red
              break;
          }
        }
      }
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Dicetak pada: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Halaman ${i} dari ${pageCount}`,
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
    
    // Save the PDF
    const fileName = `laporan-absensi-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Laporan Absensi</h2>
        <div className="flex space-x-2">
          <button
            onClick={exportDailyPDF}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export Harian</span>
          </button>
          <button
            onClick={exportMonthlyPDF}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export Bulanan</span>
          </button>
          <button
            onClick={exportFilteredPDF}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Export Filter</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filter</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
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
            >
              <option value="">Semua Kelas</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            <div className="text-sm text-gray-600">Hadir</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.sick}</div>
            <div className="text-sm text-gray-600">Sakit</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.permit}</div>
            <div className="text-sm text-gray-600">Izin</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            <div className="text-sm text-gray-600">Alpha</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.student.nis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.class?.name || 'Kelas tidak ditemukan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(record.status)}`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Tidak ada data absensi</p>
          </div>
        )}
      </div>
    </div>
  );
};