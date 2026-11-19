-- ====================================================================
-- EDUPAY: COMPLETE STUDENT PAYMENT MANAGEMENT SYSTEM
-- PostgreSQL Database Schema with Row Level Security (RLS)
-- Supabase Compatible SQL Script (All 12 Modules)
-- Project: uhwenfexhhlodksolkrl
-- ====================================================================

-- 1. Enable UUID Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Configuration: Authorized Administrator Email
CREATE OR REPLACE FUNCTION public.get_authorized_admin_email()
RETURNS TEXT AS $$
BEGIN
    RETURN 'swarnapriyaegala@gmail.com'; -- Authorized administrator email
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 3. Profiles Table (links with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Departments Table
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Courses Table (Dynamic Department-Course Mapping)
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    department_code TEXT NOT NULL REFERENCES public.departments(code) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(department_code, name)
);

-- 6. Students Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    course TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    semester TEXT NOT NULL,
    gender TEXT,
    dob DATE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Fee Categories Table
CREATE TABLE IF NOT EXISTS public.fee_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Student Fees Table
CREATE TABLE IF NOT EXISTS public.student_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    fee_category_id UUID NOT NULL REFERENCES public.fee_categories(id) ON DELETE RESTRICT,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
    due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Payments Table (Segregated Real Razorpay & Demo Modes)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    fee_id UUID REFERENCES public.student_fees(id) ON DELETE SET NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')) DEFAULT 'PENDING',
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Receipts Table
CREATE TABLE IF NOT EXISTS public.receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID UNIQUE NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    receipt_number TEXT UNIQUE NOT NULL,
    verification_code TEXT UNIQUE NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Support Requests Table (Contact Support)
CREATE TABLE IF NOT EXISTS public.support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED')) DEFAULT 'PENDING',
    admin_reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. Website Settings Table (Admin Controlled Dynamic Content)
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary_config',
    website_name TEXT NOT NULL DEFAULT 'EduPay',
    college_name TEXT NOT NULL DEFAULT 'Apex Institute of Technology & Engineering',
    website_logo_url TEXT DEFAULT '',
    college_logo_url TEXT DEFAULT '',
    hero_heading TEXT NOT NULL DEFAULT 'Smart & Secure Student Fee Payments',
    hero_description TEXT NOT NULL DEFAULT 'Manage your college fees, make secure online payments and access your payment receipts anytime.',
    contact_person TEXT NOT NULL DEFAULT 'Swarnapriya Egala',
    contact_address TEXT NOT NULL DEFAULT 'Gudivada, Andhra Pradesh, India',
    contact_phone TEXT NOT NULL DEFAULT '+91 XXXXX XXXXX',
    contact_email TEXT NOT NULL DEFAULT 'swarnapriyaegala@gmail.com',
    footer_text TEXT NOT NULL DEFAULT 'Enterprise-grade student payment infrastructure delivering automated receipting and verifiable reconciliation.',
    stats_active_students TEXT DEFAULT '14,250+',
    stats_success_rate TEXT DEFAULT '99.98%',
    stats_verified_institutions TEXT DEFAULT '48+',
    stats_avg_clearance TEXT DEFAULT '< 2 Sec',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 14. Admin Roles Table (Explicit Admin Authorization)
CREATE TABLE IF NOT EXISTS public.admin_roles (
    email TEXT PRIMARY KEY,
    granted_by TEXT NOT NULL DEFAULT 'system_init',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (AUTH GUARD)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    target_role TEXT;
BEGIN
    IF NEW.email = public.get_authorized_admin_email() OR EXISTS (SELECT 1 FROM public.admin_roles WHERE email = NEW.email) THEN
        target_role := 'admin';
    ELSE
        target_role := 'student';
    END IF;

    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        target_role
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone;
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR email = public.get_authorized_admin_email())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
DROP POLICY IF EXISTS "Profiles read" ON public.profiles;
CREATE POLICY "Profiles read" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Profiles update" ON public.profiles;
CREATE POLICY "Profiles update" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Profiles insert" ON public.profiles;
CREATE POLICY "Profiles insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());

-- Departments & Courses Policies
DROP POLICY IF EXISTS "Departments public read" ON public.departments;
CREATE POLICY "Departments public read" ON public.departments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Departments admin all" ON public.departments;
CREATE POLICY "Departments admin all" ON public.departments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Courses public read" ON public.courses;
CREATE POLICY "Courses public read" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Courses admin all" ON public.courses;
CREATE POLICY "Courses admin all" ON public.courses FOR ALL USING (public.is_admin());

-- Students Policies
DROP POLICY IF EXISTS "Students read own" ON public.students;
CREATE POLICY "Students read own" ON public.students FOR SELECT USING (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Students insert own" ON public.students;
CREATE POLICY "Students insert own" ON public.students FOR INSERT WITH CHECK (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Students update own" ON public.students;
CREATE POLICY "Students update own" ON public.students FOR UPDATE USING (profile_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Students admin all" ON public.students;
CREATE POLICY "Students admin all" ON public.students FOR ALL USING (public.is_admin());

-- Fee Categories Policies
DROP POLICY IF EXISTS "Fee categories public read" ON public.fee_categories;
CREATE POLICY "Fee categories public read" ON public.fee_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Fee categories admin all" ON public.fee_categories;
CREATE POLICY "Fee categories admin all" ON public.fee_categories FOR ALL USING (public.is_admin());

-- Student Fees Policies
DROP POLICY IF EXISTS "Student fees read own" ON public.student_fees;
CREATE POLICY "Student fees read own" ON public.student_fees FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR public.is_admin()
);

DROP POLICY IF EXISTS "Student fees admin all" ON public.student_fees;
CREATE POLICY "Student fees admin all" ON public.student_fees FOR ALL USING (public.is_admin());

-- Payments Policies
DROP POLICY IF EXISTS "Payments read own" ON public.payments;
CREATE POLICY "Payments read own" ON public.payments FOR SELECT USING (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR public.is_admin()
);

DROP POLICY IF EXISTS "Payments insert demo or own" ON public.payments;
CREATE POLICY "Payments insert demo or own" ON public.payments FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR is_demo = true OR public.is_admin()
);

-- Receipts Policies
DROP POLICY IF EXISTS "Receipts public verify" ON public.receipts;
CREATE POLICY "Receipts public verify" ON public.receipts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Receipts insert" ON public.receipts;
CREATE POLICY "Receipts insert" ON public.receipts FOR INSERT WITH CHECK (true);

-- Notifications Policies
DROP POLICY IF EXISTS "Notifications student read" ON public.notifications;
CREATE POLICY "Notifications student read" ON public.notifications FOR ALL USING (
    student_id IN (SELECT id FROM public.students WHERE profile_id = auth.uid()) OR public.is_admin()
);

-- Support Requests Policies
DROP POLICY IF EXISTS "Support requests public insert" ON public.support_requests;
CREATE POLICY "Support requests public insert" ON public.support_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Support requests student read own" ON public.support_requests;
CREATE POLICY "Support requests student read own" ON public.support_requests FOR SELECT USING (
    email = (SELECT email FROM public.profiles WHERE id = auth.uid()) OR public.is_admin()
);

DROP POLICY IF EXISTS "Support requests admin all" ON public.support_requests;
CREATE POLICY "Support requests admin all" ON public.support_requests FOR ALL USING (public.is_admin());

-- Website Settings Policies
DROP POLICY IF EXISTS "Website settings public read" ON public.website_settings;
CREATE POLICY "Website settings public read" ON public.website_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Website settings admin write" ON public.website_settings;
CREATE POLICY "Website settings admin write" ON public.website_settings FOR ALL USING (public.is_admin());

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================

-- 1. Departments
INSERT INTO public.departments (code, name, description)
VALUES 
    ('CSE', 'Computer Science & Engineering', 'Software engineering, algorithms, AI, cloud computing'),
    ('ECE', 'Electronics & Communication', 'Circuits, embedded systems, VLSI, wireless networks'),
    ('EEE', 'Electrical & Electronics Engineering', 'Power systems, machines, control engineering, renewables'),
    ('MECHANICAL', 'Mechanical Engineering', 'Thermodynamics, manufacturing, machine design, CAD/CAM'),
    ('CIVIL', 'Civil Engineering', 'Structural engineering, surveying, building materials, construction')
ON CONFLICT (code) DO NOTHING;

-- 2. Courses (Exact mapping from specifications)
INSERT INTO public.courses (department_code, name) VALUES
    ('CSE', 'C Programming'),
    ('CSE', 'C++'),
    ('CSE', 'Java'),
    ('CSE', 'Python'),
    ('CSE', 'Data Structures'),
    ('CSE', 'Database Management Systems'),
    ('CSE', 'Operating Systems'),
    ('CSE', 'Computer Networks'),
    ('CSE', 'Web Technologies'),
    ('CSE', 'Artificial Intelligence'),
    ('ECE', 'Electronic Devices and Circuits'),
    ('ECE', 'Digital Electronics'),
    ('ECE', 'Microprocessors'),
    ('ECE', 'Communication Systems'),
    ('ECE', 'Embedded Systems'),
    ('ECE', 'VLSI'),
    ('EEE', 'Electrical Circuits'),
    ('EEE', 'Electrical Machines'),
    ('EEE', 'Power Systems'),
    ('EEE', 'Control Systems'),
    ('EEE', 'Power Electronics'),
    ('MECHANICAL', 'Engineering Mechanics'),
    ('MECHANICAL', 'Thermodynamics'),
    ('MECHANICAL', 'Manufacturing Technology'),
    ('MECHANICAL', 'Fluid Mechanics'),
    ('MECHANICAL', 'Machine Design'),
    ('CIVIL', 'Surveying'),
    ('CIVIL', 'Building Materials'),
    ('CIVIL', 'Structural Engineering'),
    ('CIVIL', 'Construction Technology'),
    ('CIVIL', 'Hydraulics')
ON CONFLICT (department_code, name) DO NOTHING;

-- 3. Fee Categories
INSERT INTO public.fee_categories (id, name, description) VALUES
    ('11111111-1111-1111-1111-111111111101', 'Tuition Fee', 'Academic instruction, classroom access, faculty mentoring'),
    ('11111111-1111-1111-1111-111111111102', 'Examination Fee', 'Mid-term and End-semester evaluations & certification'),
    ('11111111-1111-1111-1111-111111111103', 'Library Fee', 'Digital e-library, journals, reference book rentals'),
    ('11111111-1111-1111-1111-111111111104', 'Laboratory Fee', 'High-performance computing lab, IoT kits, cloud servers'),
    ('11111111-1111-1111-1111-111111111105', 'Other Fees', 'Sports facilities, technical symposiums, student welfare')
ON CONFLICT (name) DO NOTHING;

-- 4. Initial Website Settings (Swarna Priya / Gudivada)
INSERT INTO public.website_settings (
    id, 
    website_name, 
    college_name, 
    hero_heading, 
    hero_description, 
    contact_person, 
    contact_address, 
    contact_phone, 
    contact_email
) VALUES (
    'primary_config',
    'EduPay',
    'Apex Institute of Technology & Engineering',
    'Smart & Secure Student Fee Payments',
    'Manage your college fees, make secure online payments and access your payment receipts anytime.',
    'Swarnapriya Egala',
    'Gudivada, Andhra Pradesh, India',
    '+91 XXXXX XXXXX',
    'swarnapriyaegala@gmail.com'
) ON CONFLICT (id) DO NOTHING;

-- 5. Seed Admin Authorization
INSERT INTO public.admin_roles (email, granted_by)
VALUES ('swarnapriyaegala@gmail.com', 'system_init')
ON CONFLICT (email) DO NOTHING;
