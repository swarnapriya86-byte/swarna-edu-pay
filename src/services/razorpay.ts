// ====================================================================
// EDUPAY - RAZORPAY STANDARD CHECKOUT CLIENT SERVICE
// Handles Razorpay SDK loading, order initiation, and secure verification
// ====================================================================

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK script from CDN.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export interface CreateOrderParams {
  amount: number;
  studentId: string;
  feeId: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  error?: string;
  needsConfig?: boolean;
}

export const createRazorpayOrder = async (params: CreateOrderParams): Promise<CreateOrderResponse> => {
  try {
    const res = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Server rejected order creation.',
        needsConfig: data.needsConfig
      };
    }

    return {
      success: true,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
      keyId: data.keyId
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error connecting to backend payment service.'
    };
  }
};

export interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  studentId: string;
  feeId: string;
  amount: number;
  paymentMethod?: string;
}

export const verifyRazorpayPayment = async (params: VerifyPaymentParams) => {
  try {
    const res = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok) {
      return {
        verified: false,
        error: data.error || 'Server signature verification rejected payment.'
      };
    }

    return data;
  } catch (err: any) {
    return {
      verified: false,
      error: err.message || 'Network error verifying transaction with backend.'
    };
  }
};
