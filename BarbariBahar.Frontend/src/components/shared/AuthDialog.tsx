import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export default function AuthDialog({ trigger, onAuthSuccess, guestOrderId }: { trigger: React.ReactNode, onAuthSuccess: (token: string) => void, guestOrderId?: number }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOtp = async () => {
    try {
        await fetch('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber: phone, guestOrderId }),
        headers: { 'Content-Type': 'application/json' },
      });
      setStep('otp');
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
        const response = await fetch('/api/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber: phone, code: otp }),
            headers: { 'Content-Type': 'application/json' },
        });
        const { token } = await response.json();
        localStorage.setItem('customer_token', token);
        onAuthSuccess(token);
    } catch (error) {
        console.error("Failed to verify OTP", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === 'phone' ? 'Enter Phone Number' : 'Enter OTP'}</DialogTitle>
        </DialogHeader>
        {step === 'phone' ? (
          <div className="space-y-4">
            <Input
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSendOtp}>Send OTP</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button onClick={handleVerifyOtp}>Verify</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
