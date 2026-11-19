import { 
  Profile, 
  Student, 
  FeeCategory, 
  StudentFee, 
  Payment, 
  Receipt, 
  Notification, 
  FeeSummary,
  Department,
  Course,
  SupportRequest,
  WebsiteSettings
} from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

export const AUTHORIZED_ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();

// Default Seed Fee Categories
export const DEFAULT_FEE_CATEGORIES: FeeCategory[] = [
  { id: 'cat-1', name: 'Tuition Fee', description: 'Academic instruction, classroom access, faculty mentoring', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-2', name: 'Examination Fee', description: 'Mid-term and End-semester evaluations & certification', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-3', name: 'Library Fee', description: 'Digital e-library, journals, reference book rentals', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-4', name: 'Laboratory Fee', description: 'High-performance computing lab, IoT kits, cloud servers', created_at: '2024-01-10T00:00:00Z' },
  { id: 'cat-5', name: 'Other Fees', description: 'Sports facilities, technical symposiums, student welfare', created_at: '2024-01-10T00:00:00Z' }
];

// Seed Profiles
export const SEED_PROFILES: Profile[] = [
  {
    id: 'user-admin-1',
    full_name: 'Swarnapriya Egala',
    email: AUTHORIZED_ADMIN_EMAIL,
    phone: '+91 98765 43210',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-stu-1',
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@edupay.ac.in',
    phone: '+91 91234 56789',
    role: 'student',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: 'user-stu-2',
    full_name: 'Priya Patel',
    email: 'priya.patel@edupay.ac.in',
    phone: '+91 98220 11223',
    role: 'student',
    created_at: '2024-01-16T00:00:00Z'
  },
  {
    id: 'user-stu-3',
    full_name: 'Vikramaditya Roy',
    email: 'vikram.roy@edupay.ac.in',
    phone: '+91 97331 44556',
    role: 'student',
    created_at: '2024-01-18T00:00:00Z'
  },
  {
    id: 'user-stu-4',
    full_name: 'Ananya Deshmukh',
    email: 'ananya.d@edupay.ac.in',
    phone: '+91 96442 77889',
    role: 'student',
    created_at: '2024-01-20T00:00:00Z'
  }
];

// Seed Students
export const SEED_STUDENTS: Student[] = [
  {
    id: 'stu-record-1',
    profile_id: 'user-stu-1',
    student_id: 'STU-2024-042',
    department: 'Computer Science & Engineering',
    course: 'Diploma in Computer Science & Engineering',
    academic_year: '2024-2025',
    semester: 'Semester 5',
    gender: 'Male',
    dob: '2004-06-15',
    address: 'Flat 402, Green Valley Enclave, IT Corridor, Bengaluru - 560103',
    created_at: '2024-01-15T00:00:00Z',
    profile: SEED_PROFILES[1]
  },
  {
    id: 'stu-record-2',
    profile_id: 'user-stu-2',
    student_id: 'STU-2024-089',
    department: 'Electronics & Communication',
    course: 'Diploma in ECE',
    academic_year: '2024-2025',
    semester: 'Semester 5',
    gender: 'Female',
    dob: '2004-09-22',
    address: 'B-12, Sunshine Avenue, Ahmedabad - 380015',
    created_at: '2024-01-16T00:00:00Z',
    profile: SEED_PROFILES[2]
  },
  {
    id: 'stu-record-3',
    profile_id: 'user-stu-3',
    student_id: 'STU-2024-115',
    department: 'Mechanical Engineering',
    course: 'Diploma in Mechanical',
    academic_year: '2024-2025',
    semester: 'Semester 3',
    gender: 'Male',
    dob: '2005-02-10',
    address: 'Plot 78, Royal Palm Garden, Pune - 411038',
    created_at: '2024-01-18T00:00:00Z',
    profile: SEED_PROFILES[3]
  },
  {
    id: 'stu-record-4',
    profile_id: 'user-stu-4',
    student_id: 'STU-2024-144',
    department: 'Information Technology',
    course: 'Diploma in IT',
    academic_year: '2024-2025',
    semester: 'Semester 5',
    gender: 'Female',
    dob: '2004-11-30',
    address: '14, Palm Grove Residency, Hyderabad - 500081',
    created_at: '2024-01-20T00:00:00Z',
    profile: SEED_PROFILES[4]
  }
];

// Seed Student Fees for Rahul Sharma (STU-2024-042)
export const SEED_FEES: StudentFee[] = [
  { id: 'fee-1', student_id: 'stu-record-1', fee_category_id: 'cat-1', total_amount: 45000, paid_amount: 25000, due_date: '2024-12-15', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[0] },
  { id: 'fee-2', student_id: 'stu-record-1', fee_category_id: 'cat-2', total_amount: 3500, paid_amount: 3500, due_date: '2024-11-30', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[1] },
  { id: 'fee-3', student_id: 'stu-record-1', fee_category_id: 'cat-3', total_amount: 2500, paid_amount: 2500, due_date: '2024-12-05', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[2] },
  { id: 'fee-4', student_id: 'stu-record-1', fee_category_id: 'cat-4', total_amount: 6000, paid_amount: 0, due_date: '2024-12-20', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[3] },
  { id: 'fee-5', student_id: 'stu-record-1', fee_category_id: 'cat-5', total_amount: 3000, paid_amount: 1500, due_date: '2024-12-31', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[4] },
  
  // Fees for Priya Patel
  { id: 'fee-6', student_id: 'stu-record-2', fee_category_id: 'cat-1', total_amount: 45000, paid_amount: 45000, due_date: '2024-12-15', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[0] },
  { id: 'fee-7', student_id: 'stu-record-2', fee_category_id: 'cat-2', total_amount: 3500, paid_amount: 3500, due_date: '2024-11-30', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[1] },
  
  // Fees for Vikramaditya Roy
  { id: 'fee-8', student_id: 'stu-record-3', fee_category_id: 'cat-1', total_amount: 42000, paid_amount: 20000, due_date: '2024-12-15', created_at: '2024-02-01T00:00:00Z', category: DEFAULT_FEE_CATEGORIES[0] }
];

// Seed Payments
export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    student_id: 'stu-record-1',
    fee_id: 'fee-2',
    transaction_id: 'DEMO-TXN-20241012-8849',
    amount: 3500,
    payment_method: 'UPI',
    status: 'SUCCESS',
    is_demo: true,
    payment_date: '2024-10-12T11:20:00Z',
    created_at: '2024-10-12T11:20:00Z'
  },
  {
    id: 'pay-2',
    student_id: 'stu-record-1',
    fee_id: 'fee-3',
    transaction_id: 'DEMO-TXN-20241018-9104',
    amount: 2500,
    payment_method: 'Debit/Credit Card',
    status: 'SUCCESS',
    is_demo: true,
    payment_date: '2024-10-18T14:45:00Z',
    created_at: '2024-10-18T14:45:00Z'
  },
  {
    id: 'pay-3',
    student_id: 'stu-record-1',
    fee_id: 'fee-1',
    transaction_id: 'DEMO-TXN-20241105-9883',
    amount: 25000,
    payment_method: 'Net Banking',
    status: 'SUCCESS',
    is_demo: true,
    payment_date: '2024-11-05T09:30:00Z',
    created_at: '2024-11-05T09:30:00Z'
  },
  {
    id: 'pay-4',
    student_id: 'stu-record-1',
    fee_id: 'fee-5',
    transaction_id: 'DEMO-TXN-20241112-9972',
    amount: 1500,
    payment_method: 'UPI',
    status: 'SUCCESS',
    is_demo: true,
    payment_date: '2024-11-12T16:15:00Z',
    created_at: '2024-11-12T16:15:00Z'
  },
  {
    id: 'pay-5',
    student_id: 'stu-record-2',
    fee_id: 'fee-6',
    transaction_id: 'DEMO-TXN-20241101-1092',
    amount: 45000,
    payment_method: 'UPI',
    status: 'SUCCESS',
    is_demo: true,
    payment_date: '2024-11-01T12:00:00Z',
    created_at: '2024-11-01T12:00:00Z'
  }
];

// Seed Receipts
export const SEED_RECEIPTS: Receipt[] = [
  {
    id: 'rcp-record-1',
    payment_id: 'pay-1',
    receipt_number: 'DEMO-RCP-2024-8849',
    verification_code: 'DEMO-9821-XQ',
    is_demo: true,
    created_at: '2024-10-12T11:20:05Z'
  },
  {
    id: 'rcp-record-2',
    payment_id: 'pay-2',
    receipt_number: 'DEMO-RCP-2024-9104',
    verification_code: 'DEMO-7740-LK',
    is_demo: true,
    created_at: '2024-10-18T14:45:05Z'
  },
  {
    id: 'rcp-record-3',
    payment_id: 'pay-3',
    receipt_number: 'DEMO-RCP-2024-9883',
    verification_code: 'DEMO-4319-BN',
    is_demo: true,
    created_at: '2024-11-05T09:30:05Z'
  },
  {
    id: 'rcp-record-4',
    payment_id: 'pay-4',
    receipt_number: 'DEMO-RCP-2024-9972',
    verification_code: 'DEMO-6502-AZ',
    is_demo: true,
    created_at: '2024-11-12T16:15:05Z'
  }
];

// Seed Notifications
export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    student_id: 'stu-record-1',
    title: 'Demo Payment Confirmed',
    message: 'Simulated payment of ₹25,000 for Tuition Fee completed. Official Demo Receipt #DEMO-RCP-2024-9883 is ready for download.',
    is_read: false,
    created_at: '2024-11-05T09:31:00Z'
  },
  {
    id: 'notif-2',
    student_id: 'stu-record-1',
    title: 'Upcoming Fee Due Date Reminder',
    message: 'Semester 5 Laboratory Fee (₹6,000) is due on 20th December 2024. Use Demo Checkout to test payment clearance.',
    is_read: false,
    created_at: '2024-11-10T10:00:00Z'
  },
  {
    id: 'notif-3',
    student_id: 'stu-record-1',
    title: 'Exam Hall Ticket Cleared',
    message: 'Your Examination Fee payment has been confirmed by the Finance Department. Examination hall ticket is unlocked.',
    is_read: true,
    created_at: '2024-10-13T08:00:00Z'
  }
];

// Seed Departments
export const SEED_DEPARTMENTS: Department[] = [
  { id: 'dept-1', code: 'CSE', name: 'Computer Science & Engineering', description: 'Software engineering, algorithms, AI, cloud computing', created_at: '2024-01-01T00:00:00Z' },
  { id: 'dept-2', code: 'ECE', name: 'Electronics & Communication', description: 'Circuits, embedded systems, VLSI, wireless networks', created_at: '2024-01-01T00:00:00Z' },
  { id: 'dept-3', code: 'EEE', name: 'Electrical & Electronics Engineering', description: 'Power systems, machines, control engineering, renewables', created_at: '2024-01-01T00:00:00Z' },
  { id: 'dept-4', code: 'MECHANICAL', name: 'Mechanical Engineering', description: 'Thermodynamics, manufacturing, machine design, CAD/CAM', created_at: '2024-01-01T00:00:00Z' },
  { id: 'dept-5', code: 'CIVIL', name: 'Civil Engineering', description: 'Structural engineering, surveying, building materials, construction', created_at: '2024-01-01T00:00:00Z' }
];

// Seed Courses (Exact requested mapping)
export const SEED_COURSES: Course[] = [
  // CSE
  { id: 'crs-1', department_code: 'CSE', name: 'C Programming', code: 'CS101', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-2', department_code: 'CSE', name: 'C++', code: 'CS102', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-3', department_code: 'CSE', name: 'Java', code: 'CS103', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-4', department_code: 'CSE', name: 'Python', code: 'CS104', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-5', department_code: 'CSE', name: 'Data Structures', code: 'CS201', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-6', department_code: 'CSE', name: 'Database Management Systems', code: 'CS202', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-7', department_code: 'CSE', name: 'Operating Systems', code: 'CS203', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-8', department_code: 'CSE', name: 'Computer Networks', code: 'CS204', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-9', department_code: 'CSE', name: 'Web Technologies', code: 'CS301', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-10', department_code: 'CSE', name: 'Artificial Intelligence', code: 'CS302', created_at: '2024-01-01T00:00:00Z' },
  // ECE
  { id: 'crs-11', department_code: 'ECE', name: 'Electronic Devices and Circuits', code: 'EC101', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-12', department_code: 'ECE', name: 'Digital Electronics', code: 'EC102', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-13', department_code: 'ECE', name: 'Microprocessors', code: 'EC201', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-14', department_code: 'ECE', name: 'Communication Systems', code: 'EC202', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-15', department_code: 'ECE', name: 'Embedded Systems', code: 'EC301', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-16', department_code: 'ECE', name: 'VLSI', code: 'EC302', created_at: '2024-01-01T00:00:00Z' },
  // EEE
  { id: 'crs-17', department_code: 'EEE', name: 'Electrical Circuits', code: 'EE101', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-18', department_code: 'EEE', name: 'Electrical Machines', code: 'EE102', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-19', department_code: 'EEE', name: 'Power Systems', code: 'EE201', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-20', department_code: 'EEE', name: 'Control Systems', code: 'EE202', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-21', department_code: 'EEE', name: 'Power Electronics', code: 'EE301', created_at: '2024-01-01T00:00:00Z' },
  // MECHANICAL
  { id: 'crs-22', department_code: 'MECHANICAL', name: 'Engineering Mechanics', code: 'ME101', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-23', department_code: 'MECHANICAL', name: 'Thermodynamics', code: 'ME102', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-24', department_code: 'MECHANICAL', name: 'Manufacturing Technology', code: 'ME201', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-25', department_code: 'MECHANICAL', name: 'Fluid Mechanics', code: 'ME202', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-26', department_code: 'MECHANICAL', name: 'Machine Design', code: 'ME301', created_at: '2024-01-01T00:00:00Z' },
  // CIVIL
  { id: 'crs-27', department_code: 'CIVIL', name: 'Surveying', code: 'CE101', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-28', department_code: 'CIVIL', name: 'Building Materials', code: 'CE102', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-29', department_code: 'CIVIL', name: 'Structural Engineering', code: 'CE201', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-30', department_code: 'CIVIL', name: 'Construction Technology', code: 'CE202', created_at: '2024-01-01T00:00:00Z' },
  { id: 'crs-31', department_code: 'CIVIL', name: 'Hydraulics', code: 'CE301', created_at: '2024-01-01T00:00:00Z' }
];

// Seed Support Requests
export const SEED_SUPPORT_REQUESTS: SupportRequest[] = [
  {
    id: 'req-1',
    name: 'Kavita Reddy',
    email: 'kavita.r@edupay.ac.in',
    phone: '+91 94401 23456',
    subject: 'Fee Concession under Merit Quota',
    message: 'Submitted the state merit scholarship documents at Counter 2. Requesting review for semester 5 tuition waiver.',
    status: 'IN_PROGRESS',
    admin_reply: 'Documents received. Verification in progress with Registrar.',
    created_at: '2024-11-14T11:20:00Z'
  },
  {
    id: 'req-2',
    name: 'Arjun Das',
    email: 'arjun.d@edupay.ac.in',
    phone: '+91 97480 12345',
    subject: 'Receipt QR Verification Query',
    message: 'Can the digital PDF receipt downloaded from EduPay be submitted directly for bank education loan reimbursement?',
    status: 'RESOLVED',
    admin_reply: 'Yes, the cryptographic QR code is recognized by scheduled nationalized banks.',
    created_at: '2024-11-10T14:45:00Z'
  }
];

// Default Website Settings
export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  website_name: 'EduPay',
  college_name: 'Apex Institute of Technology & Engineering',
  website_logo_url: '',
  college_logo_url: '',
  hero_heading: 'Smart & Secure Student Fee Payments',
  hero_description: 'Manage your college fees, make secure online payments and access your payment receipts anytime.',
  contact_person: 'Swarnapriya Egala',
  contact_address: 'Gudivada, Andhra Pradesh, India',
  contact_phone: '+91 XXXXX XXXXX',
  contact_email: 'swarnapriyaegala@gmail.com',
  footer_text: 'Enterprise-grade student payment infrastructure delivering automated receipting and verifiable reconciliation.',
  stats_active_students: '14,250+',
  stats_success_rate: '99.98%',
  stats_verified_institutions: '48+',
  stats_avg_clearance: '< 2 Sec'
};

const STORAGE_KEYS = {
  PROFILES: 'edupay_profiles_v3',
  STUDENTS: 'edupay_students_v3',
  CATEGORIES: 'edupay_categories_v3',
  FEES: 'edupay_fees_v3',
  PAYMENTS: 'edupay_payments_v3',
  RECEIPTS: 'edupay_receipts_v3',
  NOTIFICATIONS: 'edupay_notifications_v3',
  DEPARTMENTS: 'edupay_departments_v4',
  COURSES: 'edupay_courses_v4',
  SUPPORT_REQUESTS: 'edupay_support_requests_v4',
  WEBSITE_SETTINGS: 'edupay_website_settings_v5'
};

class DataStoreService {
  private getStorage<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private setStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  public init() {
    let profiles = this.getStorage<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
    // Ensure Demo Admin account is always synchronized to Swarnapriya Egala
    const adminIndex = profiles.findIndex(p => p.role === 'admin' || p.id === 'user-admin-1');
    if (adminIndex !== -1) {
      profiles[adminIndex] = {
        ...profiles[adminIndex],
        id: 'user-admin-1',
        full_name: 'Swarnapriya Egala',
        email: AUTHORIZED_ADMIN_EMAIL,
        role: 'admin'
      };
      this.setStorage(STORAGE_KEYS.PROFILES, profiles);
    } else {
      profiles.unshift(SEED_PROFILES[0]);
      this.setStorage(STORAGE_KEYS.PROFILES, profiles);
    }

    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
      this.setStorage(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.setStorage(STORAGE_KEYS.CATEGORIES, DEFAULT_FEE_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEES)) {
      this.setStorage(STORAGE_KEYS.FEES, SEED_FEES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.setStorage(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
      this.setStorage(STORAGE_KEYS.RECEIPTS, SEED_RECEIPTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.setStorage(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
      this.setStorage(STORAGE_KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      this.setStorage(STORAGE_KEYS.COURSES, SEED_COURSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_REQUESTS)) {
      this.setStorage(STORAGE_KEYS.SUPPORT_REQUESTS, SEED_SUPPORT_REQUESTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.WEBSITE_SETTINGS)) {
      this.setStorage(STORAGE_KEYS.WEBSITE_SETTINGS, DEFAULT_WEBSITE_SETTINGS);
    }
  }

  // --- Profiles & Auth ---
  public getProfiles(): Profile[] {
    return this.getStorage<Profile[]>(STORAGE_KEYS.PROFILES, SEED_PROFILES);
  }

  public getProfileByEmail(email: string): Profile | undefined {
    return this.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
  }

  public getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id);
  }

  public isAuthorizedAdminEmail(email: string): boolean {
    return email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL;
  }

  // --- Students ---
  public getStudents(): Student[] {
    const students = this.getStorage<Student[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
    const profiles = this.getProfiles();
    return students.map(s => ({
      ...s,
      profile: profiles.find(p => p.id === s.profile_id)
    }));
  }

  public getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  public getStudentByProfileId(profileId: string): Student | undefined {
    return this.getStudents().find(s => s.profile_id === profileId);
  }

  public getStudentByStudentId(studentId: string): Student | undefined {
    return this.getStudents().find(s => s.student_id.toLowerCase() === studentId.toLowerCase());
  }

  public addStudent(studentData: Omit<Student, 'id' | 'created_at' | 'profile_id'> & { full_name: string; email: string; phone: string; profile_id?: string }): Student {
    const profiles = this.getProfiles();
    const students = this.getStudents();

    const isTargetAdmin = studentData.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL;

    const newProfile: Profile = {
      id: 'user-' + Date.now(),
      full_name: studentData.full_name,
      email: studentData.email,
      phone: studentData.phone,
      role: isTargetAdmin ? 'admin' : 'student',
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    this.setStorage(STORAGE_KEYS.PROFILES, profiles);

    const newStudent: Student = {
      id: 'stu-' + Date.now(),
      profile_id: newProfile.id,
      student_id: studentData.student_id,
      department: studentData.department,
      course: studentData.course,
      academic_year: studentData.academic_year,
      semester: studentData.semester,
      gender: studentData.gender,
      dob: studentData.dob,
      address: studentData.address,
      created_at: new Date().toISOString(),
      profile: newProfile
    };
    students.push(newStudent);
    this.setStorage(STORAGE_KEYS.STUDENTS, students);

    // Initialize Default Fees
    const categories = this.getFeeCategories();
    const fees = this.getFees();
    const defaultAmounts: Record<string, number> = {
      'Tuition Fee': 45000,
      'Examination Fee': 3500,
      'Library Fee': 2500,
      'Laboratory Fee': 6000,
      'Other Fees': 3000
    };

    categories.forEach(cat => {
      fees.push({
        id: 'fee-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        student_id: newStudent.id,
        fee_category_id: cat.id,
        total_amount: defaultAmounts[cat.name] || 5000,
        paid_amount: 0,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        category: cat
      });
    });
    this.setStorage(STORAGE_KEYS.FEES, fees);

    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student> & { full_name?: string; email?: string; phone?: string }): Student | null {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    const student = students[index];
    if (updates.full_name || updates.email || updates.phone) {
      const profiles = this.getProfiles();
      const pIndex = profiles.findIndex(p => p.id === student.profile_id);
      if (pIndex !== -1) {
        profiles[pIndex] = {
          ...profiles[pIndex],
          ...(updates.full_name && { full_name: updates.full_name }),
          ...(updates.email && { email: updates.email }),
          ...(updates.phone && { phone: updates.phone }),
        };
        this.setStorage(STORAGE_KEYS.PROFILES, profiles);
      }
    }

    students[index] = { ...student, ...updates };
    this.setStorage(STORAGE_KEYS.STUDENTS, students);
    return students[index];
  }

  public deleteStudent(id: string): boolean {
    let students = this.getStudents();
    const student = students.find(s => s.id === id);
    if (!student) return false;

    students = students.filter(s => s.id !== id);
    this.setStorage(STORAGE_KEYS.STUDENTS, students);

    let fees = this.getFees().filter(f => f.student_id !== id);
    this.setStorage(STORAGE_KEYS.FEES, fees);

    return true;
  }

  // --- Fee Categories ---
  public getFeeCategories(): FeeCategory[] {
    return this.getStorage<FeeCategory[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_FEE_CATEGORIES);
  }

  public addFeeCategory(name: string, description: string): FeeCategory {
    const categories = this.getFeeCategories();
    const newCategory: FeeCategory = {
      id: 'cat-' + Date.now(),
      name,
      description,
      created_at: new Date().toISOString()
    };
    categories.push(newCategory);
    this.setStorage(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  }

  // --- Student Fees ---
  public getFees(): StudentFee[] {
    const fees = this.getStorage<StudentFee[]>(STORAGE_KEYS.FEES, SEED_FEES);
    const categories = this.getFeeCategories();
    return fees.map(f => ({
      ...f,
      category: categories.find(c => c.id === f.fee_category_id)
    }));
  }

  public getFeesByStudentId(studentId: string): StudentFee[] {
    return this.getFees().filter(f => f.student_id === studentId);
  }

  public updateFeeAmount(feeId: string, totalAmount: number, dueDate: string): StudentFee | null {
    const fees = this.getFees();
    const index = fees.findIndex(f => f.id === feeId);
    if (index === -1) return null;
    fees[index].total_amount = totalAmount;
    fees[index].due_date = dueDate;
    this.setStorage(STORAGE_KEYS.FEES, fees);
    return fees[index];
  }

  public assignFeeToStudent(studentId: string, categoryId: string, amount: number, dueDate: string): StudentFee {
    const fees = this.getFees();
    const categories = this.getFeeCategories();
    const cat = categories.find(c => c.id === categoryId);

    const newFee: StudentFee = {
      id: 'fee-' + Date.now(),
      student_id: studentId,
      fee_category_id: categoryId,
      total_amount: amount,
      paid_amount: 0,
      due_date: dueDate,
      created_at: new Date().toISOString(),
      category: cat
    };
    fees.push(newFee);
    this.setStorage(STORAGE_KEYS.FEES, fees);
    return newFee;
  }

  // --- Payments (With Real vs Demo Segregation) ---
  public getPayments(): Payment[] {
    const payments = this.getStorage<Payment[]>(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
    const students = this.getStudents();
    const fees = this.getFees();

    return payments.map(p => ({
      ...p,
      student: students.find(s => s.id === p.student_id),
      fee: fees.find(f => f.id === p.fee_id)
    }));
  }

  public getPaymentsByStudentId(studentId: string): Payment[] {
    return this.getPayments().filter(p => p.student_id === studentId);
  }

  public getRealPayments(): Payment[] {
    return this.getPayments().filter(p => !p.is_demo);
  }

  public getDemoPayments(): Payment[] {
    return this.getPayments().filter(p => p.is_demo);
  }

  // --- Receipts ---
  public getReceipts(): Receipt[] {
    const receipts = this.getStorage<Receipt[]>(STORAGE_KEYS.RECEIPTS, SEED_RECEIPTS);
    const payments = this.getPayments();

    return receipts.map(r => ({
      ...r,
      payment: payments.find(p => p.id === r.payment_id)
    }));
  }

  public getReceiptByPaymentId(paymentId: string): Receipt | undefined {
    return this.getReceipts().find(r => r.payment_id === paymentId);
  }

  public getReceiptByNumber(receiptNumber: string): Receipt | undefined {
    return this.getReceipts().find(r => r.receipt_number.toUpperCase() === receiptNumber.toUpperCase());
  }

  public getReceiptByVerificationCode(code: string): Receipt | undefined {
    return this.getReceipts().find(r => r.verification_code.toUpperCase() === code.toUpperCase());
  }

  // Create Payment Record (Fully supports Demo & Real Modes, updates status, balances, Supabase)
  public createPayment(data: {
    studentId: string;
    feeId: string;
    amount: number;
    paymentMethod: Payment['payment_method'];
    status: Payment['status'];
    isDemo?: boolean;
    transactionId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
  }): { payment: Payment; receipt?: Receipt } {
    const payments = this.getPayments();
    const now = new Date().toISOString();
    const isDemo = data.isDemo !== undefined ? data.isDemo : true;

    // Build or use provided unique Transaction ID
    let txnId = data.transactionId;
    if (!txnId) {
      if (isDemo) {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const rand = Math.floor(1000 + Math.random() * 9000);
        txnId = `DEMO-TXN-${timestamp}-${rand}`;
      } else if (data.razorpayPaymentId) {
        txnId = `TXN-RZP-${data.razorpayPaymentId}`;
      } else {
        txnId = `TXN-RZP-${Date.now()}`;
      }
    }

    const newPayment: Payment = {
      id: 'pay-' + Date.now(),
      student_id: data.studentId,
      fee_id: data.feeId,
      transaction_id: txnId,
      amount: data.amount,
      payment_method: data.paymentMethod,
      status: data.status,
      is_demo: isDemo,
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      razorpay_signature: data.razorpaySignature,
      payment_date: now,
      created_at: now
    };

    payments.unshift(newPayment);
    this.setStorage(STORAGE_KEYS.PAYMENTS, payments);

    let receipt: Receipt | undefined;

    // On SUCCESS: update student fee paid amount & generate official receipt
    if (data.status === 'SUCCESS') {
      const fees = this.getFees();
      const feeIndex = fees.findIndex(f => f.id === data.feeId);
      if (feeIndex !== -1) {
        fees[feeIndex].paid_amount = (fees[feeIndex].paid_amount || 0) + data.amount;
        this.setStorage(STORAGE_KEYS.FEES, fees);
      }

      // Generate Receipt
      const receipts = this.getReceipts();
      const prefix = isDemo ? 'DEMO-RCP' : 'RCP';
      const verifPrefix = isDemo ? 'DEMO' : 'VERIF';

      const rcpNum = `${prefix}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const verifCode = `${verifPrefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 4).toUpperCase()}`;

      receipt = {
        id: 'rcp-' + Date.now(),
        payment_id: newPayment.id,
        receipt_number: rcpNum,
        verification_code: verifCode,
        is_demo: isDemo,
        created_at: now
      };
      receipts.unshift(receipt);
      this.setStorage(STORAGE_KEYS.RECEIPTS, receipts);

      // Notification
      const modeTag = isDemo ? '[DEMO SUCCESS]' : '[VERIFIED SUCCESS]';
      this.sendNotification(
        data.studentId,
        `Payment Confirmed ${modeTag}`,
        `Payment of ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod} was confirmed (Txn #${txnId}). Receipt #${rcpNum} is available for download.`
      );
    } else if (data.status === 'FAILED') {
      // On FAILURE: fee balance is NOT updated; send alert notification
      this.sendNotification(
        data.studentId,
        '[DEMO TRANSACTION FAILED]',
        `Simulated payment of ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod} was declined by bank simulator (Ref: ${txnId}). Fee balance remains unchanged.`
      );
    }

    // Asynchronous Supabase sync when Supabase is configured
    if (isSupabaseConfigured && supabase) {
      try {
        supabase.from('payments').insert({
          student_id: newPayment.student_id,
          fee_id: newPayment.fee_id,
          transaction_id: newPayment.transaction_id,
          amount: newPayment.amount,
          payment_method: newPayment.payment_method,
          status: newPayment.status,
          is_demo: newPayment.is_demo,
          payment_date: newPayment.payment_date
        }).then(({ error }) => {
          if (error) console.warn('Supabase payments sync note:', error.message);
        });

        if (receipt) {
          supabase.from('receipts').insert({
            payment_id: newPayment.id,
            receipt_number: receipt.receipt_number,
            verification_code: receipt.verification_code,
            is_demo: receipt.is_demo
          }).then(({ error }) => {
            if (error) console.warn('Supabase receipts sync note:', error.message);
          });
        }
      } catch (err) {
        console.warn('Supabase sync skipped:', err);
      }
    }

    return { payment: newPayment, receipt };
  }

  // --- Notifications ---
  public getNotifications(studentId?: string): Notification[] {
    const notifs = this.getStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    if (!studentId) return notifs;
    return notifs.filter(n => n.student_id === studentId);
  }

  public markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index !== -1) {
      notifs[index].is_read = true;
      this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  public markAllNotificationsRead(studentId: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.student_id === studentId ? { ...n, is_read: true } : n);
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  public sendNotification(studentId: string, title: string, message: string): Notification {
    const notifs = this.getNotifications();
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      student_id: studentId,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    };
    notifs.unshift(newNotif);
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  }

  public broadcastNotification(title: string, message: string): void {
    const students = this.getStudents();
    students.forEach(s => {
      this.sendNotification(s.id, title, message);
    });
  }

  // --- Fee Summary Calculations ---
  public getFeeSummary(studentId: string): FeeSummary {
    const fees = this.getFeesByStudentId(studentId);
    const payments = this.getPaymentsByStudentId(studentId).filter(p => p.status === 'SUCCESS');

    let totalFee = 0;
    let totalPaid = 0;
    let realPaid = 0;
    let demoPaid = 0;
    let nextDueDate: string | null = null;

    fees.forEach(f => {
      totalFee += Number(f.total_amount);
      totalPaid += Number(f.paid_amount || 0);
    });

    payments.forEach(p => {
      if (p.is_demo) {
        demoPaid += Number(p.amount);
      } else {
        realPaid += Number(p.amount);
      }
    });

    const today = new Date().toISOString().split('T')[0];
    const upcomingDues = fees
      .filter(f => Number(f.total_amount) > Number(f.paid_amount || 0) && f.due_date >= today)
      .map(f => f.due_date)
      .sort();

    if (upcomingDues.length > 0) {
      nextDueDate = upcomingDues[0];
    }

    const pendingAmount = Math.max(0, totalFee - totalPaid);
    const paymentProgress = totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;

    return {
      totalFee,
      totalPaid,
      realPaid,
      demoPaid,
      pendingAmount,
      nextDueDate,
      paymentProgress
    };
  }

  // --- Admin Analytics (Real Collection vs Demo Volume) ---
  public getAdminAnalytics() {
    const students = this.getStudents();
    const fees = this.getFees();
    const payments = this.getPayments();

    let totalExpectedFees = 0;
    fees.forEach(f => {
      totalExpectedFees += Number(f.total_amount);
    });

    // Real collections ONLY (Non-demo SUCCESS payments)
    const realSuccessfulPayments = payments.filter(p => p.status === 'SUCCESS' && !p.is_demo);
    const realCollected = realSuccessfulPayments.reduce((acc, p) => acc + Number(p.amount), 0);

    // Demo volume separately
    const demoPayments = payments.filter(p => p.is_demo);
    const demoVolume = demoPayments
      .filter(p => p.status === 'SUCCESS')
      .reduce((acc, p) => acc + Number(p.amount), 0);

    const totalPending = Math.max(0, totalExpectedFees - realCollected);
    const overallCollectionRate = totalExpectedFees > 0 ? Math.round((realCollected / totalExpectedFees) * 100) : 0;

    // Department Stats (Real figures)
    const deptMap: Record<string, { total: number; collected: number; pending: number; demoVolume: number }> = {};
    students.forEach(s => {
      if (!deptMap[s.department]) {
        deptMap[s.department] = { total: 0, collected: 0, pending: 0, demoVolume: 0 };
      }
      const sFees = fees.filter(f => f.student_id === s.id);
      sFees.forEach(f => {
        deptMap[s.department].total += Number(f.total_amount);
      });

      const sRealPayments = payments.filter(p => p.student_id === s.id && p.status === 'SUCCESS' && !p.is_demo);
      sRealPayments.forEach(p => {
        deptMap[s.department].collected += Number(p.amount);
      });

      const sDemoPayments = payments.filter(p => p.student_id === s.id && p.status === 'SUCCESS' && p.is_demo);
      sDemoPayments.forEach(p => {
        deptMap[s.department].demoVolume += Number(p.amount);
      });

      deptMap[s.department].pending = Math.max(0, deptMap[s.department].total - deptMap[s.department].collected);
    });

    const departmentStats = Object.keys(deptMap).map(dept => ({
      name: dept,
      total: deptMap[dept].total,
      collected: deptMap[dept].collected,
      pending: deptMap[dept].pending,
      demoVolume: deptMap[dept].demoVolume,
      collectionRate: deptMap[dept].total > 0 ? Math.round((deptMap[dept].collected / deptMap[dept].total) * 100) : 0
    }));

    return {
      totalStudents: students.length,
      totalExpectedFees,
      realCollected,
      demoVolume,
      totalPending,
      overallCollectionRate,
      realTransactionsCount: realSuccessfulPayments.length,
      demoTransactionsCount: demoPayments.length,
      departmentStats
    };
  }

  // ====================================================================
  // DEPARTMENTS MANAGEMENT
  // ====================================================================
  public getDepartments(): Department[] {
    return this.getStorage<Department[]>(STORAGE_KEYS.DEPARTMENTS, SEED_DEPARTMENTS);
  }

  public addDepartment(data: { code: string; name: string; description?: string }): Department {
    const departments = this.getDepartments();
    const newDept: Department = {
      id: 'dept-' + Date.now(),
      code: data.code.toUpperCase().trim(),
      name: data.name.trim(),
      description: data.description || '',
      created_at: new Date().toISOString()
    };
    departments.push(newDept);
    this.setStorage(STORAGE_KEYS.DEPARTMENTS, departments);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from('departments').insert({
        code: newDept.code,
        name: newDept.name,
        description: newDept.description
      }).then(({ error }) => {
        if (error) console.warn('Supabase department sync note:', error.message);
      });
    }

    return newDept;
  }

  public updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const departments = this.getDepartments();
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) return null;

    departments[index] = { ...departments[index], ...updates };
    this.setStorage(STORAGE_KEYS.DEPARTMENTS, departments);
    return departments[index];
  }

  public deleteDepartment(id: string): boolean {
    const departments = this.getDepartments();
    const target = departments.find(d => d.id === id);
    if (!target) return false;

    const filtered = departments.filter(d => d.id !== id);
    this.setStorage(STORAGE_KEYS.DEPARTMENTS, filtered);

    // Also remove associated courses
    const courses = this.getCourses();
    const filteredCourses = courses.filter(c => c.department_code !== target.code);
    this.setStorage(STORAGE_KEYS.COURSES, filteredCourses);

    return true;
  }

  // ====================================================================
  // COURSES MANAGEMENT
  // ====================================================================
  public getCourses(departmentCode?: string): Course[] {
    const courses = this.getStorage<Course[]>(STORAGE_KEYS.COURSES, SEED_COURSES);
    if (!departmentCode) return courses;
    return courses.filter(c => c.department_code.toUpperCase() === departmentCode.toUpperCase());
  }

  public addCourse(data: { department_code: string; name: string; code?: string; description?: string }): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      id: 'crs-' + Date.now(),
      department_code: data.department_code.toUpperCase().trim(),
      name: data.name.trim(),
      code: data.code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      description: data.description || '',
      created_at: new Date().toISOString()
    };
    courses.push(newCourse);
    this.setStorage(STORAGE_KEYS.COURSES, courses);

    // Sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      supabase.from('courses').insert({
        department_code: newCourse.department_code,
        name: newCourse.name,
        code: newCourse.code,
        description: newCourse.description
      }).then(({ error }) => {
        if (error) console.warn('Supabase course sync note:', error.message);
      });
    }

    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | null {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) return null;

    courses[index] = { ...courses[index], ...updates };
    this.setStorage(STORAGE_KEYS.COURSES, courses);
    return courses[index];
  }

  public deleteCourse(id: string): boolean {
    const courses = this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    if (filtered.length === courses.length) return false;
    this.setStorage(STORAGE_KEYS.COURSES, filtered);
    return true;
  }

  // ====================================================================
  // SUPPORT REQUESTS MANAGEMENT (CONTACT SUPPORT)
  // ====================================================================
  public getSupportRequests(): SupportRequest[] {
    return this.getStorage<SupportRequest[]>(STORAGE_KEYS.SUPPORT_REQUESTS, SEED_SUPPORT_REQUESTS);
  }

  public addSupportRequest(data: {
    student_id?: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): SupportRequest {
    const requests = this.getSupportRequests();
    const newReq: SupportRequest = {
      id: 'req-' + Date.now(),
      student_id: data.student_id,
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone || '',
      subject: data.subject.trim(),
      message: data.message.trim(),
      status: 'PENDING',
      created_at: new Date().toISOString()
    };
    requests.unshift(newReq);
    this.setStorage(STORAGE_KEYS.SUPPORT_REQUESTS, requests);

    // Sync to Supabase support_requests table
    if (isSupabaseConfigured && supabase) {
      supabase.from('support_requests').insert({
        name: newReq.name,
        email: newReq.email,
        phone: newReq.phone,
        subject: newReq.subject,
        message: newReq.message,
        status: newReq.status
      }).then(({ error }) => {
        if (error) console.warn('Supabase support_request note:', error.message);
      });
    }

    return newReq;
  }

  public updateSupportRequest(id: string, updates: Partial<SupportRequest>): SupportRequest | null {
    const requests = this.getSupportRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;

    requests[index] = {
      ...requests[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.setStorage(STORAGE_KEYS.SUPPORT_REQUESTS, requests);
    return requests[index];
  }

  public deleteSupportRequest(id: string): boolean {
    const requests = this.getSupportRequests();
    const filtered = requests.filter(r => r.id !== id);
    if (filtered.length === requests.length) return false;
    this.setStorage(STORAGE_KEYS.SUPPORT_REQUESTS, filtered);
    return true;
  }

  // ====================================================================
  // WEBSITE MANAGEMENT (ADMIN CONTROLLED DYNAMIC CONTENT)
  // ====================================================================
  public getWebsiteSettings(): WebsiteSettings {
    return this.getStorage<WebsiteSettings>(STORAGE_KEYS.WEBSITE_SETTINGS, DEFAULT_WEBSITE_SETTINGS);
  }

  public updateWebsiteSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
    const current = this.getWebsiteSettings();
    const updated: WebsiteSettings = {
      ...current,
      ...updates
    };
    this.setStorage(STORAGE_KEYS.WEBSITE_SETTINGS, updated);

    // Sync to Supabase website_settings table
    if (isSupabaseConfigured && supabase) {
      supabase.from('website_settings').upsert({
        id: 'primary_config',
        ...updated,
        updated_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.warn('Supabase website_settings note:', error.message);
      });
    }

    // Dispatch global event for instantaneous reactive UI update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('edupay_settings_updated', { detail: updated }));
    }

    return updated;
  }
}

export const dataStore = new DataStoreService();
dataStore.init();
