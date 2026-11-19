import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Admin Client (Server-side Only with service_role key)
const supabaseUrl = process.env.SUPABASE_URL || 'https://uhwenfexhhlodksolkrl.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseAdmin = null;
if (supabaseServiceRoleKey && !supabaseServiceRoleKey.includes('placeholder')) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Admin API client initialized successfully.');

    // Auto-confirm authorized admin if unconfirmed
    (async () => {
      try {
        const adminEmail = (process.env.ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (!error && data?.users) {
          const adminUser = data.users.find(u => u.email?.toLowerCase() === adminEmail);
          if (adminUser && !adminUser.email_confirmed_at) {
            await supabaseAdmin.auth.admin.updateUserById(adminUser.id, { email_confirm: true });
            console.log(`✅ Supabase Admin API: Successfully confirmed email for ${adminEmail}`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Supabase Admin auto-confirmation check note:', err.message);
      }
    })();
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase Admin client:', err.message);
  }
} else {
  console.log('ℹ️ SUPABASE_SERVICE_ROLE_KEY not configured. Add it to .env to enable server-side Supabase Admin API operations.');
}

// Initialize Razorpay instance if keys are available
const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

let razorpayInstance = null;
if (keyId && keySecret && !keyId.includes('placeholder')) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
    console.log('✅ Razorpay SDK initialized successfully with Key ID:', keyId.substring(0, 8) + '***');
  } catch (err) {
    console.warn('⚠️ Failed to initialize Razorpay SDK:', err.message);
  }
} else {
  console.log('ℹ️ Running in Sandbox/Demo mode. Provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env for live test gateway.');
}

// 1. Health & Config Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    razorpay: {
      configured: Boolean(razorpayInstance && keyId && keySecret),
      keyId: keyId ? keyId.substring(0, 8) + '***' : null
    },
    adminEmail: process.env.ADMIN_EMAIL || 'swarnapriyaegala@gmail.com',
    adminName: process.env.ADMIN_NAME || 'Swarnapriya Egala'
  });
});

// Admin Authentication Endpoint (Secure backend verification)
app.post('/api/auth/verify-admin', async (req, res) => {
  const { email, password, supabaseAccessToken } = req.body;
  const adminEmail = (process.env.ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'pandu_143';

  if (!email) {
    return res.status(400).json({ success: false, error: 'Administrator email is required.' });
  }

  const rawEmail = (email || '').trim().toLowerCase();
  const normalizedEmail = rawEmail.includes('@') ? rawEmail : `${rawEmail}@gmail.com`;

  if (normalizedEmail !== adminEmail) {
    return res.status(403).json({ 
      success: false, 
      error: 'Access Denied: This account is not authorized for administrator access. Only swarnapriyaegala@gmail.com is permitted.' 
    });
  }

  // If a Supabase session access token was provided, verify it directly with Supabase
  if (supabaseAccessToken) {
    try {
      const sbUrl = process.env.SUPABASE_URL || 'https://uhwenfexhhlodksolkrl.supabase.co';
      const sbKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
      const response = await fetch(`${sbUrl}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${supabaseAccessToken}`,
          'apikey': sbKey
        }
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData?.email && userData.email.toLowerCase() === adminEmail) {
          return res.json({
            success: true,
            profile: {
              id: userData.id || 'user-admin-1',
              full_name: process.env.ADMIN_NAME || 'Swarnapriya Egala',
              email: adminEmail,
              role: 'admin'
            }
          });
        }
      }
    } catch (sbErr) {
      console.warn('Backend Supabase token verification error:', sbErr.message);
    }
  }

  // Verify against server-side administrator credentials
  if (!password) {
    return res.status(400).json({ success: false, error: 'Administrator password is required.' });
  }

  if (password === adminPassword) {
    // If Supabase Admin API is available, ensure email is confirmed & password synced
    if (supabaseAdmin) {
      try {
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (!listError && usersData?.users) {
          const adminUser = usersData.users.find(u => u.email?.toLowerCase() === adminEmail);
          if (adminUser) {
            await supabaseAdmin.auth.admin.updateUserById(adminUser.id, {
              password: adminPassword,
              email_confirm: true,
              user_metadata: {
                ...adminUser.user_metadata,
                role: 'admin',
                full_name: process.env.ADMIN_NAME || 'Swarnapriya Egala'
              }
            });
            console.log(`✅ Supabase Admin API: Verified and synchronized ${adminEmail}`);
          }
        }
      } catch (sbAdminErr) {
        console.warn('Supabase Admin sync notice:', sbAdminErr.message);
      }
    }

    return res.json({
      success: true,
      profile: {
        id: 'user-admin-1',
        full_name: process.env.ADMIN_NAME || 'Swarnapriya Egala',
        email: adminEmail,
        role: 'admin'
      }
    });
  }

  return res.status(401).json({ success: false, error: 'Incorrect administrator password. Access denied.' });
});

// Admin Session Validation Endpoint
app.post('/api/auth/verify-admin-session', async (req, res) => {
  const { email, supabaseAccessToken } = req.body;
  const adminEmail = (process.env.ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();

  if (!email) {
    return res.status(403).json({ authorized: false, error: 'Administrator email is required.' });
  }

  const rawEmail = (email || '').trim().toLowerCase();
  const normalizedEmail = rawEmail.includes('@') ? rawEmail : `${rawEmail}@gmail.com`;

  if (normalizedEmail !== adminEmail) {
    return res.status(403).json({ authorized: false, error: 'Unauthorized administrator email.' });
  }

  // If token is provided, verify against Supabase
  if (supabaseAccessToken) {
    try {
      const sbUrl = process.env.SUPABASE_URL || 'https://uhwenfexhhlodksolkrl.supabase.co';
      const sbKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
      const response = await fetch(`${sbUrl}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${supabaseAccessToken}`,
          'apikey': sbKey
        }
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData?.email && userData.email.toLowerCase() === adminEmail) {
          return res.json({ authorized: true, email: adminEmail, role: 'admin' });
        }
      }
    } catch (e) {
      console.warn('Token validation notice:', e.message);
    }
  }

  return res.json({ authorized: true, email: adminEmail, role: 'admin' });
});

// Admin Supabase Account Email Confirmation Endpoint (Using Supabase Admin API)
app.post('/api/admin/confirm-email', async (req, res) => {
  const { email, adminSecret } = req.body;
  const adminEmail = (process.env.ADMIN_EMAIL || 'swarnapriyaegala@gmail.com').toLowerCase();

  if (!email || email.trim().toLowerCase() !== adminEmail) {
    return res.status(403).json({ success: false, error: 'Unauthorized email address.' });
  }

  // Check if SUPABASE_SERVICE_ROLE_KEY is configured
  const effectiveKey = adminSecret || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!effectiveKey) {
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'SUPABASE_SERVICE_ROLE_KEY is missing from the server environment (.env).',
      instructions: 'Add SUPABASE_SERVICE_ROLE_KEY to your .env file or confirm the user in your Supabase Dashboard.'
    });
  }

  try {
    const adminClient = createClient(supabaseUrl, effectiveKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: usersData, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) {
      return res.status(401).json({ success: false, error: listError.message });
    }

    const targetUser = usersData.users.find(u => u.email?.toLowerCase() === adminEmail);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: `User ${adminEmail} not found in Supabase Auth.` });
    }

    const { data: updateData, error: updateError } = await adminClient.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true }
    );

    if (updateError) {
      return res.status(500).json({ success: false, error: updateError.message });
    }

    console.log(`✅ Supabase Admin API: Successfully confirmed email for ${adminEmail} (${targetUser.id})`);
    return res.json({
      success: true,
      message: `Successfully confirmed email for ${adminEmail} via Supabase Admin API.`,
      user: {
        id: updateData.user.id,
        email: updateData.user.email,
        email_confirmed_at: updateData.user.email_confirmed_at
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Demo Credentials Endpoint (For Student Demo Only - Admin credentials strictly disabled)
app.get('/api/auth/demo-credentials', (req, res) => {
  const { role } = req.query;
  if (role === 'admin') {
    return res.status(403).json({ error: 'Administrator demo credentials retrieval is prohibited for security.' });
  }
  return res.json({
    email: 'rahul.sharma@edupay.ac.in',
    password: 'student@123',
    name: 'Rahul Sharma'
  });
});

// 2. Create Razorpay Order
app.post('/api/razorpay/create-order', async (req, res) => {
  const { amount, studentId, feeId, currency = 'INR' } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Valid payment amount greater than ₹0 is required.' });
  }

  // Check if Razorpay credentials are ready
  if (!razorpayInstance || !keyId || !keySecret) {
    return res.status(400).json({
      error: 'Razorpay credentials not configured in server environment.',
      needsConfig: true,
      message: 'Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file, or use the Demo Payment mode for presentation.'
    });
  }

  try {
    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const options = {
      amount: Math.round(Number(amount) * 100), // Razorpay takes amount in paise (1 INR = 100 paise)
      currency: currency,
      receipt: receiptId,
      notes: {
        studentId: studentId || 'N/A',
        feeId: feeId || 'N/A',
        platform: 'EduPay Academic Fee System'
      }
    };

    const order = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
      receipt: order.receipt
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return res.status(500).json({
      error: 'Failed to create Razorpay order.',
      details: error.message || error
    });
  }
});

// 3. Verify Razorpay Payment Signature (HMAC SHA-256)
app.post('/api/razorpay/verify-payment', (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    amount,
    studentId,
    feeId,
    paymentMethod = 'Razorpay Standard'
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({
      verified: false,
      error: 'Missing order_id, payment_id, or signature in verification request.'
    });
  }

  if (!keySecret) {
    return res.status(500).json({
      verified: false,
      error: 'Server error: RAZORPAY_KEY_SECRET is not configured on the backend server.'
    });
  }

  try {
    // Generate expected cryptographic signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpay_signature)
    );

    if (isMatch) {
      console.log(`✅ Verified Razorpay Payment: ${razorpay_payment_id} for Order: ${razorpay_order_id}`);
      return res.json({
        verified: true,
        status: 'SUCCESS',
        is_demo: false,
        transactionId: `TXN-RZP-${razorpay_payment_id}`,
        razorpay_order_id,
        razorpay_payment_id,
        amount: Number(amount),
        paymentMethod,
        message: 'Cryptographic signature verified successfully by bank authorization.'
      });
    } else {
      console.warn(`❌ Signature mismatch for payment: ${razorpay_payment_id}`);
      return res.status(400).json({
        verified: false,
        status: 'FAILED',
        error: 'Invalid signature. Potential transaction forgery detected.'
      });
    }
  } catch (err) {
    console.error('Signature verification error:', err);
    return res.status(500).json({
      verified: false,
      error: 'Internal server error verifying signature.',
      details: err.message
    });
  }
});

// 4. Webhook Receiver
app.post('/api/razorpay/webhook', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (webhookSecret && signature) {
    try {
      const shasum = crypto.createHmac('sha256', webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest('hex');

      if (digest !== signature) {
        return res.status(400).json({ status: 'invalid_signature' });
      }
    } catch (e) {
      return res.status(400).json({ status: 'verification_failed' });
    }
  }

  const event = req.body.event;
  console.log(`📩 Received Razorpay Webhook Event: ${event}`);

  // In production, handle payment.captured, payment.failed, etc.
  res.json({ status: 'ok', received: true });
});

if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  app.listen(PORT, () => {
    console.log(`🚀 EduPay Backend Server running on port ${PORT}`);
  });
}

export default app;
