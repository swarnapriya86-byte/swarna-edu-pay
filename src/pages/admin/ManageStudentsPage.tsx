import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Building,
  Mail,
  Phone,
  Hash
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { Modal } from '../../components/common/Modal';
import { dataStore } from '../../services/dataStore';
import { Student } from '../../types';
import { useToast } from '../../context/ToastContext';

export const ManageStudentsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { success, error } = useToast();

  const [students, setStudents] = useState<Student[]>(dataStore.getStudents());
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDept, setFormDept] = useState('Computer Science & Engineering');
  const [formCourse, setFormCourse] = useState('Diploma CSE');
  const [formYear, setFormYear] = useState('2024-2025');
  const [formSemester, setFormSemester] = useState('Semester 5');
  const [formAddress, setFormAddress] = useState('');

  const refreshList = () => {
    setStudents(dataStore.getStudents());
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormName('');
    setFormStudentId(`STU-2024-${Math.floor(200 + Math.random() * 800)}`);
    setFormEmail('');
    setFormPhone('+91 9');
    setFormDept('Computer Science & Engineering');
    setFormCourse('Diploma in Computer Science & Engineering');
    setFormYear('2024-2025');
    setFormSemester('Semester 5');
    setFormAddress('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (stu: Student) => {
    setEditingStudent(stu);
    setFormName(stu.profile?.full_name || '');
    setFormStudentId(stu.student_id);
    setFormEmail(stu.profile?.email || '');
    setFormPhone(stu.profile?.phone || '');
    setFormDept(stu.department);
    setFormCourse(stu.course);
    setFormYear(stu.academic_year);
    setFormSemester(stu.semester);
    setFormAddress(stu.address || '');
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove student "${name}"? This will delete all fee assignments.`)) {
      dataStore.deleteStudent(id);
      refreshList();
      success(`Student "${name}" deleted successfully.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formStudentId || !formEmail) {
      error('Please complete mandatory fields.');
      return;
    }

    if (editingStudent) {
      dataStore.updateStudent(editingStudent.id, {
        full_name: formName,
        email: formEmail,
        phone: formPhone,
        department: formDept,
        course: formCourse,
        academic_year: formYear,
        semester: formSemester,
        address: formAddress
      });
      success(`Student "${formName}" updated successfully.`);
    } else {
      dataStore.addStudent({
        full_name: formName,
        student_id: formStudentId,
        email: formEmail,
        phone: formPhone,
        department: formDept,
        course: formCourse,
        academic_year: formYear,
        semester: formSemester,
        gender: 'Male',
        dob: '2004-01-01',
        address: formAddress,
        profile_id: ''
      });
      success(`New student "${formName}" enrolled successfully.`);
    }

    setIsAddModalOpen(false);
    refreshList();
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.student_id.toLowerCase().includes(search.toLowerCase()) ||
                          (s.profile?.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
                          (s.profile?.email || '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Student Registry Management"
          subtitle="Enroll, update, and manage academic profiles and fee allocations"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Action Header */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enrolled Students ({filtered.length})
              </h3>
              <p className="text-xs text-slate-500">Search by student roll number or name</p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll New Student</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, roll number, or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Departments</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Student Name</th>
                    <th className="py-3.5 px-4 font-bold">Roll Number</th>
                    <th className="py-3.5 px-4 font-bold">Department & Course</th>
                    <th className="py-3.5 px-4 font-bold">Contact</th>
                    <th className="py-3.5 px-4 font-bold">Academic Term</th>
                    <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No students found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {s.profile?.full_name || 'Student Name'}
                          </div>
                          <div className="text-[11px] text-slate-400">{s.profile?.email}</div>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                          {s.student_id}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{s.department}</div>
                          <div className="text-[11px] text-slate-400">{s.course}</div>
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400 font-mono">
                          {s.profile?.phone || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-slate-600 dark:text-slate-400">
                          {s.academic_year} • {s.semester}
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEdit(s)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Student"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id, s.profile?.full_name || s.student_id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingStudent ? 'Edit Student Profile' : 'Enroll New Student'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="e.g. Ananya Deshmukh"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Student ID / Roll No *
              </label>
              <input
                type="text"
                required
                value={formStudentId}
                onChange={e => setFormStudentId(e.target.value)}
                placeholder="STU-2024-001"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                placeholder="student@edupay.ac.in"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formPhone}
                onChange={e => setFormPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Department
              </label>
              <select
                value={formDept}
                onChange={e => setFormDept(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-300 font-semibold block mb-1">
                Academic Course
              </label>
              <input
                type="text"
                value={formCourse}
                onChange={e => setFormCourse(e.target.value)}
                placeholder="Diploma in CSE"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all"
            >
              {editingStudent ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
