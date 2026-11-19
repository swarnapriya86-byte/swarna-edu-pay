import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  BookOpen, 
  Mail, 
  Phone, 
  Hash, 
  MapPin, 
  Calendar,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { AdminSidebar } from '../../components/dashboard/AdminSidebar';
import { TopHeader } from '../../components/dashboard/TopHeader';
import { dataStore } from '../../services/dataStore';
import { useToast } from '../../context/ToastContext';

export const AddStudentPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useToast();

  const departments = dataStore.getDepartments();
  const [department, setDepartment] = useState(departments[0]?.name || 'Computer Science & Engineering');
  const [course, setCourse] = useState('');

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('2004-05-15');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('Semester 1');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available courses dynamically based on department
  const selectedDeptObj = departments.find(d => d.name === department || d.code === department);
  const availableCourses = dataStore.getCourses(selectedDeptObj?.code || department);

  const handleDepartmentChange = (deptName: string) => {
    setDepartment(deptName);
    const deptObj = departments.find(d => d.name === deptName || d.code === deptName);
    const crs = dataStore.getCourses(deptObj?.code || deptName);
    setCourse(crs[0]?.name || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !studentId.trim() || !email.trim() || !phone.trim() || !course) {
      error('Please complete all mandatory fields (*).');
      return;
    }

    // Email check
    const existingEmail = dataStore.getProfileByEmail(email.trim().toLowerCase());
    if (existingEmail) {
      error('A student or account with this email address already exists.');
      return;
    }

    // Student ID check
    const existingId = dataStore.getStudentByStudentId(studentId.trim().toUpperCase());
    if (existingId) {
      error('A student with this Student ID already exists.');
      return;
    }

    setIsSubmitting(true);
    try {
      dataStore.addStudent({
        student_id: studentId.trim().toUpperCase(),
        department,
        course,
        academic_year: academicYear,
        semester,
        gender,
        dob,
        address: address.trim(),
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim()
      });

      setIsSubmitting(false);
      success(`Student ${fullName} (${studentId}) enrolled successfully with initialized semester fees!`);
      navigate('/admin/students');
    } catch (err: any) {
      setIsSubmitting(false);
      error(err.message || 'Failed to enroll student.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] text-[#172B4D] dark:text-slate-100 flex transition-colors">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <TopHeader
          onMenuClick={() => setSidebarOpen(true)}
          title="Enroll New Student"
          subtitle="Add student record, assign academic department, and initialize default semester fees"
        />

        <main className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Students List</span>
            </Link>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Institutional Enrollment Form
                  </h2>
                  <p className="text-xs text-slate-500">Student account will automatically receive default fee schedules</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  1. Personal & Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sen"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Student ID / Roll Number *
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        placeholder="STU-2024-099"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="student@edupay.ac.in"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Affiliation */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  2. Academic Department & Dynamic Course
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Department *
                    </label>
                    <select
                      value={department}
                      onChange={e => handleDepartmentChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900 dark:text-white"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>
                          {d.name} ({d.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Course Program *
                    </label>
                    <select
                      required
                      value={course}
                      onChange={e => setCourse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-900 dark:text-white"
                    >
                      <option value="">-- Select Course --</option>
                      {availableCourses.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name} {c.code ? `(${c.code})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Academic Year
                    </label>
                    <select
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="2024-2025">2024-2025 (Current)</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2025-2026">2025-2026</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                      Semester
                    </label>
                    <select
                      value={semester}
                      onChange={e => setSemester(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                      <option value="Semester 3">Semester 3</option>
                      <option value="Semester 4">Semester 4</option>
                      <option value="Semester 5">Semester 5</option>
                      <option value="Semester 6">Semester 6</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Address
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Residential address"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Automatic Fee Initialization</span>
                </span>
                <p className="text-emerald-700 dark:text-emerald-300 text-[11px] leading-relaxed">
                  Upon saving, EduPay will automatically generate Tuition Fee (₹45,000), Examination Fee (₹3,500), Library Fee (₹2,500), and Laboratory Fee (₹6,000) records for this student.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/students')}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Enroll Student</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
