import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  BookOpen, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Hash,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { dataStore } from '../services/dataStore';
import { Department, Course } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  // Dynamic Departments & Courses from DataStore (Admin Managed)
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('Semester 1');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const depts = dataStore.getDepartments();
    const crs = dataStore.getCourses();
    setDepartments(depts);
    setAllCourses(crs);
  }, []);

  // When department changes, reset course and display only matching courses
  const handleDepartmentChange = (deptName: string) => {
    setDepartment(deptName);
    setCourse(''); // Reset previously selected course

    if (!deptName) {
      setAvailableCourses([]);
      return;
    }

    const matchedDept = departments.find(d => d.name === deptName || d.code === deptName);
    const deptCode = matchedDept ? matchedDept.code : deptName;
    const filtered = allCourses.filter(c => c.department_code.toUpperCase() === deptCode.toUpperCase());
    setAvailableCourses(filtered);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Mandatory Fields Validation
    if (!fullName.trim() || !studentId.trim() || !email.trim() || !phone.trim() || !department || !course || !password || !confirmPassword) {
      error('Please complete all required fields (*), including department and course.');
      return;
    }

    // 2. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      error('Please provide a valid email address.');
      return;
    }

    // 3. Phone Number Validation (At least 10 digits)
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      error('Please enter a valid 10-digit phone number.');
      return;
    }

    // 4. Password Confirm Validation
    if (password !== confirmPassword) {
      error('Password and Confirm Password do not match.');
      return;
    }

    // 5. Password Length Validation
    if (password.length < 6) {
      error('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      full_name: fullName.trim(),
      student_id: studentId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      dob,
      department,
      course,
      academic_year: academicYear,
      semester,
      address: address.trim(),
      password
    });
    setIsSubmitting(false);

    if (result.success) {
      success('Student registration successful! Role: Student. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    } else {
      error(result.error || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FF] dark:bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8 transition-colors relative">
      <div className="max-w-3xl mx-auto">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <CreditCard className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#142B4A] dark:text-white">
              Edu<span className="text-blue-600">Pay</span>
            </span>
          </Link>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-[#142B4A] dark:text-white tracking-tight">
            Student Account Registration
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Create your student portal profile to access fees, online receipts, and payment simulations
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section 1: Basic Information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal & Contact Details
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
                    placeholder="e.g. Rahul Sharma"
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
                      placeholder="STU-2024-001"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase font-mono"
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
                    Phone Number (10 Digits) *
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

            {/* Section 2: Academic Details with Dynamic Dependent Dropdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Academic Affiliation & Dynamic Course Selection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department Dropdown */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={department}
                    onChange={e => handleDepartmentChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-slate-900 dark:text-white"
                  >
                    <option value="">-- Select Academic Department --</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Course Dropdown (Disabled until department is chosen) */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Course / Subject Program *
                  </label>
                  <select
                    required
                    disabled={!department}
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium transition-all ${
                      !department
                        ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-blue-300 dark:border-blue-700 shadow-sm'
                    }`}
                  >
                    <option value="">
                      {!department ? '← Select a department first' : '-- Select Course in this Department --'}
                    </option>
                    {availableCourses.map(crs => (
                      <option key={crs.id} value={crs.name}>
                        {crs.name} {crs.code ? `(${crs.code})` : ''}
                      </option>
                    ))}
                  </select>
                  {!department && (
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Course list activates automatically upon department selection
                    </span>
                  )}
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
                    Current Semester
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
                  Permanent / Residential Address
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Door No, Street Name, City, State - PIN"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Section 3: Security & Credentials */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Account Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Password (Min 6 Characters) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                      </div>
                      <span className="text-[10px] text-slate-500">
                        Strength: <strong className="text-slate-700 dark:text-slate-200">{strength.label}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Passwords do not match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Guard Notice */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Strict Role Assignment
                </span>
                All student registrations automatically receive the <strong>Student</strong> role. Administrative accounts cannot be registered publicly and require designated backend authorization.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Student Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Footer link */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
              Already enrolled?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Log In to Student Portal
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
