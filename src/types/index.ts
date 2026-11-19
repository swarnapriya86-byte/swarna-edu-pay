export type UserRole = 'student' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Course {
  id: string;
  department_code: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
}

export interface Student {
  id: string;
  profile_id: string;
  student_id: string;
  department: string;
  course: string;
  academic_year: string;
  semester: string;
  gender: string;
  dob: string;
  address: string;
  created_at: string;
  profile?: Profile;
}

export interface FeeCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface StudentFee {
  id: string;
  student_id: string;
  fee_category_id: string;
  total_amount: number;
  paid_amount?: number;
  due_date: string;
  created_at: string;
  category?: FeeCategory;
}

export type PaymentMethod = 'UPI' | 'Debit/Credit Card' | 'Net Banking' | 'Razorpay Standard';
export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface Payment {
  id: string;
  student_id: string;
  fee_id: string;
  transaction_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  is_demo: boolean;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_date: string;
  created_at: string;
  student?: Student;
  fee?: StudentFee;
}

export interface Receipt {
  id: string;
  payment_id: string;
  receipt_number: string;
  verification_code: string;
  is_demo: boolean;
  created_at: string;
  payment?: Payment;
}

export interface Notification {
  id: string;
  student_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportRequest {
  id: string;
  student_id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  admin_reply?: string;
  created_at: string;
  updated_at?: string;
}

export interface WebsiteSettings {
  website_name: string;
  college_name: string;
  website_logo_url: string;
  college_logo_url: string;
  hero_heading: string;
  hero_description: string;
  contact_person: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  footer_text: string;
  stats_active_students: string;
  stats_success_rate: string;
  stats_verified_institutions: string;
  stats_avg_clearance: string;
}

export interface FeeSummary {
  totalFee: number;
  totalPaid: number;
  pendingAmount: number;
  nextDueDate: string | null;
  paymentProgress: number;
  realPaid: number;
  demoPaid: number;
}
