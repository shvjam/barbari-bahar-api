// src/pages/quote/QuoteDetailsForm.tsx (with Auth Dialog)
import React, { useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuote } from '../../context/QuoteContext';
import { Button } from '../../components/ui/button';
import LiveInvoice from '../../components/shared/LiveInvoice';
import AuthDialog from '../../components/shared/AuthDialog'; // <-- Import AuthDialog
// ... other imports

const initialState = { step: 4, /* ... */ };
// ... reducer

export default function QuoteDetailsForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();
  const { guestOrderId } = useQuote();

  const handleAuthSuccess = (token: string) => {
    // This is where we will call the backend to associate the order
    console.log("Auth successful, token received:", token);
    // In the next step, we'll implement the backend call here
    navigate('/dashboard/customer');
  };

  const renderStep = () => {
    switch (state.step) {
      // ... other cases
      default:
        return (
          <div>
            <h2 className="text-lg font-bold">سفارش شما آماده ثبت است!</h2>
            <p className="text-muted-foreground mb-4">برای نهایی کردن سفارش، لطفا وارد حساب کاربری خود شوید یا ثبت نام کنید.</p>
            <AuthDialog
              trigger={<Button size="lg">تأیید و ورود</Button>}
              onAuthSuccess={handleAuthSuccess}
              guestOrderId={guestOrderId} // Pass guestOrderId to the auth component
            />
          </div>
        );
    }
  };

  return (
    <div className="container py-8">
      {/* ... layout ... */}
      {renderStep()}
      {/* ... */}
    </div>
  );
}
