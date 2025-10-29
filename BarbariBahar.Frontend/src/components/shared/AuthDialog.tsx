// src/components/shared/AuthDialog.tsx (modified)
import React, { useState } from 'react';
// ... other imports

export default function AuthDialog({ trigger, onAuthSuccess, guestOrderId }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');

  const handleSendOtp = async () => {
    // API call to send OTP, now including guestOrderId
    await fetch('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber: phone, guestOrderId }), // <-- Pass guestOrderId
      headers: { 'Content-Type': 'application/json' },
    });
    setStep('otp');
  };

  const handleVerifyOtp = async (otp: string) => {
    const response = await fetch('/api/auth/verify-otp', { /* ... */ });
    const { token } = await response.json();
    localStorage.setItem('customer_token', token);
    onAuthSuccess(token);
  };

  return (
    // ... Dialog JSX
  );
}
