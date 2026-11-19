import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.SUPABASE_ANON_KEY || 
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    })
  : null;

export interface SupabaseHealthReport {
  isConfigured: boolean;
  projectUrl: string;
  authOperational: boolean;
  tableStatus: Record<string, 'ready' | 'missing' | 'error'>;
  missingTables: string[];
  checkedAt: string;
}

export const checkSupabaseHealth = async (): Promise<SupabaseHealthReport> => {
  const report: SupabaseHealthReport = {
    isConfigured: isSupabaseConfigured,
    projectUrl: supabaseUrl ? supabaseUrl.replace(/https?:\/\//, '').split('.')[0] : 'not-configured',
    authOperational: false,
    tableStatus: {},
    missingTables: [],
    checkedAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured || !supabase) {
    return report;
  }

  // Check Auth service
  try {
    const { error: sessionError } = await supabase.auth.getSession();
    report.authOperational = !sessionError;
  } catch (err) {
    report.authOperational = false;
  }

  // Check tables
  const expectedTables = [
    'profiles',
    'students',
    'fee_categories',
    'student_fees',
    'payments',
    'receipts',
    'notifications'
  ];

  for (const table of expectedTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.message.includes('Could not find the table') || error.code === '42P01') {
          report.tableStatus[table] = 'missing';
          report.missingTables.push(table);
        } else {
          // May be an RLS restriction or other benign note, which means table exists!
          report.tableStatus[table] = 'ready';
        }
      } else {
        report.tableStatus[table] = 'ready';
      }
    } catch {
      report.tableStatus[table] = 'error';
      report.missingTables.push(table);
    }
  }

  return report;
};
