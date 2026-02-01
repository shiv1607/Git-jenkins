import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import { KeyRound, Lock, Sparkles, Shield } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showLoginLink, setShowLoginLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowLoginLink(false);
    try {
      await apiService.resetPassword(token, newPassword);
      setMessage('Password reset successful! You can now log in.');
      setShowLoginLink(true);
    } catch (err) {
      setError('Invalid or expired token, or server error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      <div className="max-w-md w-full space-y-8 relative">
        <div className="glass-card rounded-3xl shadow-2xl p-8 animate-slide-up">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">Paste your token and set a new password.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {message && (
              <div className="text-green-600 mb-2">
                {message}
                {showLoginLink && (
                  <Link
                    to="/login"
                    className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Go to Login
                  </Link>
                )}
              </div>
            )}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div>
              <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
                Reset Token
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="elegant-input pl-12"
                  placeholder="Enter the token from your email"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="elegant-input pl-12"
                  placeholder="Enter your new password"
                  required
                />
              </div>
            </div>
            <button type="submit" className="premium-button w-full group">
              <div className="flex items-center justify-center">
                <span>Reset Password</span>
                <Sparkles className="h-5 w-5 ml-2 group-hover:animate-spin" />
              </div>
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
