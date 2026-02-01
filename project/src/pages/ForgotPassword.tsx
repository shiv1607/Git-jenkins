// src/pages/ForgotPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [sent, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
          await fetch('http://localhost:3048/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x">
      <form onSubmit={handleSubmit} className="glass bg-white/70 border-2 border-blue-200 shadow-2xl max-w-md w-full flex flex-col items-center p-10 rounded-3xl animate-fade-in relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 shadow-lg animate-bounce">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 mt-8">Forgot Password</h2>
        <p className="text-gray-500 mb-6 text-center">Enter your email to receive a reset token.</p>
        {sent ? (
          <div className="text-green-600 font-medium text-center">A reset token has been sent to your email.<br/>You will be redirected to reset password shortly.</div>
        ) : (
          <>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border-2 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 p-3 rounded-xl mb-4 transition-all duration-200 text-gray-900 bg-blue-50/50 backdrop-blur-sm"
            />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200">Send Reset Token</button>
          </>
        )}
      </form>
    </div>
  );
}
