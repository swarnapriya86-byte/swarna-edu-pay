import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, Student, UserRole } from '../types';
import { dataStore, SEED_PROFILES, SEED_STUDENTS, AUTHORIZED_ADMIN_EMAIL } from '../services/dataStore';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: Profile | null;
  student: Student | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, expectedRole?: UserRole, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    full_name: string;
    student_id: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    department: string;
    course: string;
    academic_year: string;
    semester: string;
    address: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  verifyAdminOtp: (token: string) => Promise<{ success: boolean; error?: string }>;
  resendAdminConfirmation: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_SESSION_KEY = 'edupay_auth_session_v3';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. Check active Supabase session
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const sbUser = data.session.user;
            const userEmail = (sbUser.email || '').toLowerCase();

            // If Supabase user is the authorized admin, verify backend authorization
            if (userEmail === AUTHORIZED_ADMIN_EMAIL) {
              try {
                const verifyRes = await fetch('/api/auth/verify-admin-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    email: userEmail,
                    supabaseAccessToken: data.session.access_token 
                  })
                });
                if (verifyRes.ok) {
                  const verified = await verifyRes.json();
                  if (verified.authorized) {
                    const adminProfile: Profile = {
                      id: sbUser.id,
                      full_name: 'Swarnapriya Egala',
                      email: AUTHORIZED_ADMIN_EMAIL,
                      phone: '+91 98765 43210',
                      role: 'admin',
                      created_at: sbUser.created_at
                    };
                    setUser(adminProfile);
                    setStudent(null);
                    setIsLoading(false);
                    return;
                  }
                }
              } catch (e) {
                console.warn('Backend admin session check error:', e);
              }
            } else {
              // Student user from Supabase
              let profile: Profile | null = null;
              try {
                const { data: dbProfile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', sbUser.id)
                  .maybeSingle();

                if (dbProfile) {
                  profile = dbProfile as Profile;
                }
              } catch (err) {
                console.warn('Supabase profile fetch notice:', err);
              }

              if (!profile) {
                profile = dataStore.getProfileByEmail(userEmail) || {
                  id: sbUser.id,
                  full_name: sbUser.user_metadata?.full_name || userEmail.split('@')[0],
                  email: userEmail,
                  phone: sbUser.user_metadata?.phone || '',
                  role: 'student',
                  created_at: sbUser.created_at
                };
              }

              setUser(profile);

              let stu: Student | null = null;
              try {
                const { data: dbStudent } = await supabase
                  .from('students')
                  .select('*')
                  .eq('profile_id', sbUser.id)
                  .maybeSingle();

                if (dbStudent) {
                  stu = { ...dbStudent, profile } as Student;
                }
              } catch (err) {
                console.warn('Supabase student fetch notice:', err);
              }

              if (!stu) {
                stu = dataStore.getStudentByProfileId(profile.id) || null;
              }
              setStudent(stu);
              setIsLoading(false);
              return;
            }
          }
        }

        // 2. Check Local Cached Session
        const savedSession = localStorage.getItem(CURRENT_SESSION_KEY);
        if (savedSession) {
          const parsed = JSON.parse(savedSession);
          if (parsed.email && parsed.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL && parsed.role === 'admin') {
            // Verify admin session against backend server
            try {
              const verifyRes = await fetch('/api/auth/verify-admin-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: parsed.email.toLowerCase() })
              });
              if (verifyRes.ok) {
                const verified = await verifyRes.json();
                if (verified.authorized) {
                  setUser(SEED_PROFILES[0]);
                  setStudent(null);
                  setIsLoading(false);
                  return;
                }
              }
            } catch {
              // Server unreachable
            }
            // If verification failed, clear unverified admin session
            localStorage.removeItem(CURRENT_SESSION_KEY);
          } else if (parsed.role === 'student') {
            const foundProfile = dataStore.getProfileById(parsed.userId) || dataStore.getProfileByEmail(parsed.email || '');
            if (foundProfile && foundProfile.role === 'student') {
              setUser(foundProfile);
              const stu = dataStore.getStudentByProfileId(foundProfile.id);
              setStudent(stu || null);
              setIsLoading(false);
              return;
            }
          }
        }

        // 3. No default session: Unauthenticated visitors start with no active session
        setUser(null);
        setStudent(null);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (
    email: string, 
    expectedRole?: UserRole, 
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const rawInput = email.trim().toLowerCase();
      const normalizedEmail = rawInput.includes('@') ? rawInput : `${rawInput}@gmail.com`;

      // ====================================================================
      // 1. ADMIN AUTHORIZATION & VERIFICATION
      // ====================================================================
      if (expectedRole === 'admin' || normalizedEmail === AUTHORIZED_ADMIN_EMAIL) {
        if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
          return {
            success: false,
            error: 'Access Denied: This account is not authorized for administrator access. Only swarnapriyaegala@gmail.com is permitted.'
          };
        }

        if (!password) {
          return {
            success: false,
            error: 'Please enter your administrator password.'
          };
        }

        let supabaseToken: string | undefined;

        // Step A: Attempt Supabase Authentication (optional sync if configured)
        if (isSupabaseConfigured && supabase) {
          try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
              email: normalizedEmail,
              password
            });

            if (!authError && authData?.session) {
              supabaseToken = authData.session.access_token;
            }
          } catch (sbErr: any) {
            console.warn('Supabase direct login check note:', sbErr?.message);
          }
        }

        // Step B: Verify on Backend Server
        let backendAuthorized = false;
        let backendErrorMsg = '';

        try {
          const res = await fetch('/api/auth/verify-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: normalizedEmail, 
              password,
              supabaseAccessToken: supabaseToken 
            })
          });
          const result = await res.json();
          if (res.ok && result.success) {
            backendAuthorized = true;
          } else {
            backendErrorMsg = result.error || 'Administrator verification failed.';
          }
        } catch (fetchErr: any) {
          console.warn('Backend verification connection note:', fetchErr?.message);
        }

        // Must pass verification
        if (!backendAuthorized) {
          return {
            success: false,
            error: backendErrorMsg || 'Incorrect administrator email or password. Access denied.'
          };
        }

        const adminProfile: Profile = {
          id: 'user-admin-1',
          full_name: 'Swarnapriya Egala',
          email: AUTHORIZED_ADMIN_EMAIL,
          phone: '+91 98765 43210',
          role: 'admin',
          created_at: new Date().toISOString()
        };

        setUser(adminProfile);
        setStudent(null);
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ 
          userId: adminProfile.id, 
          email: adminProfile.email,
          role: 'admin'
        }));
        return { success: true };
      }

      // ====================================================================
      // 2. STUDENT AUTHENTICATION
      // ====================================================================
      if (isSupabaseConfigured && supabase && password) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });

          if (!authError && authData?.user) {
            const sbUser = authData.user;
            let profile: Profile | null = null;
            try {
              const { data: dbProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', sbUser.id)
                .maybeSingle();
              if (dbProfile) profile = dbProfile as Profile;
            } catch {
              // Ignore
            }

            if (!profile) {
              profile = {
                id: sbUser.id,
                full_name: sbUser.user_metadata?.full_name || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                phone: sbUser.user_metadata?.phone || '',
                role: 'student',
                created_at: sbUser.created_at
              };
            }

            let stu: Student | null = null;
            try {
              const { data: dbStudent } = await supabase
                .from('students')
                .select('*')
                .eq('profile_id', sbUser.id)
                .maybeSingle();
              if (dbStudent) stu = { ...dbStudent, profile } as Student;
            } catch {
              // Ignore
            }

            if (!stu) {
              stu = dataStore.getStudentByProfileId(profile.id) || null;
            }

            setUser(profile);
            setStudent(stu);
            localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ 
              userId: profile.id, 
              email: profile.email,
              role: 'student'
            }));
            return { success: true };
          }
        } catch (sbErr) {
          console.warn('Supabase student login check:', sbErr);
        }
      }

      // Local demo student authentication fallback
      let studentProfile = dataStore.getProfileByEmail(normalizedEmail);
      if (!studentProfile && normalizedEmail.includes('rahul')) {
        studentProfile = SEED_PROFILES[1];
      }

      if (!studentProfile) {
        return { 
          success: false, 
          error: 'No student account found matching this email address. Please register.' 
        };
      }

      setUser(studentProfile);
      const stu = dataStore.getStudentByProfileId(studentProfile.id);
      setStudent(stu || null);
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ 
        userId: studentProfile.id, 
        email: studentProfile.email,
        role: 'student'
      }));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    full_name: string;
    student_id: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    department: string;
    course: string;
    academic_year: string;
    semester: string;
    address: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const normalizedEmail = data.email.trim().toLowerCase();

      // Check unique email in local store
      const existingEmail = dataStore.getProfileByEmail(normalizedEmail);
      if (existingEmail) {
        return { success: false, error: 'A student with this email address is already enrolled.' };
      }

      // Check unique student ID
      const existingStudent = dataStore.getStudentByStudentId(data.student_id);
      if (existingStudent) {
        return { success: false, error: 'A student with this Student ID / Roll Number already exists.' };
      }

      let supabaseUserId: string | undefined;

      // ====================================================================
      // 1. SUPABASE AUTH REGISTRATION
      // ====================================================================
      if (isSupabaseConfigured && supabase && data.password) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: normalizedEmail,
            password: data.password,
            options: {
              data: {
                full_name: data.full_name,
                phone: data.phone,
                student_id: data.student_id
              }
            }
          });

          if (authError) {
            // Note if already registered in Supabase
            if (authError.message.includes('already registered')) {
              return { success: false, error: 'An account with this email already exists in Supabase.' };
            }
            console.warn('Supabase Auth note:', authError.message);
          } else if (authData?.user) {
            supabaseUserId = authData.user.id;

            // Try syncing into Supabase tables if schema has been applied
            try {
              await supabase.from('profiles').upsert({
                id: supabaseUserId,
                full_name: data.full_name,
                email: normalizedEmail,
                phone: data.phone,
                role: 'student'
              });

              await supabase.from('students').upsert({
                profile_id: supabaseUserId,
                student_id: data.student_id,
                department: data.department,
                course: data.course,
                academic_year: data.academic_year,
                semester: data.semester,
                gender: data.gender,
                dob: data.dob,
                address: data.address
              });
            } catch (dbErr) {
              console.warn('Supabase DB table insertion note:', dbErr);
            }
          }
        } catch (sbErr) {
          console.warn('Supabase registration error handled gracefully:', sbErr);
        }
      }

      // ====================================================================
      // 2. LOCAL DATA STORE REGISTRATION (Always succeeds and activates immediately)
      // ====================================================================
      dataStore.addStudent({
        student_id: data.student_id,
        profile_id: supabaseUserId || '',
        department: data.department,
        course: data.course,
        academic_year: data.academic_year,
        semester: data.semester,
        gender: data.gender,
        dob: data.dob,
        address: data.address,
        full_name: data.full_name,
        email: normalizedEmail,
        phone: data.phone
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed.' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signOut note:', err);
    }
    setUser(null);
    setStudent(null);
    localStorage.removeItem(CURRENT_SESSION_KEY);
    try {
      sessionStorage.clear();
    } catch {
      // Ignore
    }
  };

  const switchRole = (newRole: UserRole) => {
    // Elevation to Administrator without explicit login is strictly prohibited
    if (newRole === 'admin') {
      console.warn('Direct role elevation to admin is prohibited. Please use the Admin Login portal.');
      return;
    }
    const studentProfile = SEED_PROFILES[1];
    const studentRecord = dataStore.getStudentByProfileId(studentProfile.id) || SEED_STUDENTS[0];
    setUser(studentProfile);
    setStudent(studentRecord);
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ 
      userId: studentProfile.id,
      email: studentProfile.email,
      role: 'student'
    }));
  };

  const verifyAdminOtp = async (token: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase client is not configured.' };
    }
    try {
      const cleanToken = token.trim();
      let authSession = null;
      let authUser = null;

      const { data, error } = await supabase.auth.verifyOtp({
        email: AUTHORIZED_ADMIN_EMAIL,
        token: cleanToken,
        type: 'signup'
      });

      if (!error && data?.session) {
        authSession = data.session;
        authUser = data.user;
      } else {
        const { data: data2, error: error2 } = await supabase.auth.verifyOtp({
          email: AUTHORIZED_ADMIN_EMAIL,
          token: cleanToken,
          type: 'email'
        });
        if (!error2 && data2?.session) {
          authSession = data2.session;
          authUser = data2.user;
        } else {
          return { success: false, error: error2?.message || error?.message || 'Invalid verification token.' };
        }
      }

      const adminProfile: Profile = {
        id: authUser?.id || 'user-admin-1',
        full_name: 'Swarnapriya Egala',
        email: AUTHORIZED_ADMIN_EMAIL,
        phone: '+91 98765 43210',
        role: 'admin',
        created_at: new Date().toISOString()
      };

      setUser(adminProfile);
      setStudent(null);
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({ 
        userId: adminProfile.id,
        email: adminProfile.email,
        role: 'admin'
      }));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'OTP verification error.' };
    }
  };

  const resendAdminConfirmation = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase client is not configured.' };
    }
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: AUTHORIZED_ADMIN_EMAIL
      });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to resend confirmation email.' };
    }
  };

  const isAdmin = Boolean(
    user && 
    user.role === 'admin' && 
    user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        role: user?.role || null,
        isAuthenticated: !!user,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        verifyAdminOtp,
        resendAdminConfirmation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
