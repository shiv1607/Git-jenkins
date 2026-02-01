// src/pages/ResetPassword.tsx
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    const res = await fetch('http://localhost:3048/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password }),
    });
    if (res.ok) setDone(true);
    else setError('Invalid or expired token.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-gradient-x">
      <form onSubmit={handleSubmit} className="glass bg-white/70 border-2 border-purple-200 shadow-2xl max-w-md w-full flex flex-col items-center p-10 rounded-3xl animate-fade-in relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-4 shadow-lg animate-bounce">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-2 mt-8">Reset Password</h2>
        <p className="text-gray-500 mb-6 text-center">Paste your reset token and choose a new password.</p>
        {done ? (
          <div className="text-green-600 font-medium text-center">Password reset successful! You can now log in.</div>
        ) : (
          <>
            <input
              type="text"
              required
              placeholder="Enter reset token"
              value={token}
              onChange={e => setToken(e.target.value)}
              className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 p-3 rounded-xl mb-4 transition-all duration-200 text-gray-900 bg-purple-50/50 backdrop-blur-sm"
            />
            <div className="relative w-full mb-4">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 p-3 rounded-xl transition-all duration-200 text-gray-900 bg-purple-50/50 backdrop-blur-sm pr-12"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative w-full mb-4">
              <input
                type={showConfirm ? "text" : "password"}
                required
                placeholder="Confirm new password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 p-3 rounded-xl transition-all duration-200 text-gray-900 bg-purple-50/50 backdrop-blur-sm pr-12"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowConfirm(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 focus:outline-none"
              >
                {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow hover:from-blue-700 hover:to-purple-700 transition-all duration-200">Reset Password</button>
            {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
          </>
        )}
      </form>
    </div>
  );
}
