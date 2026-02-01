import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { Link } from 'react-router-dom';
import { Mail, Sparkles, Shield } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showResetLink, setShowResetLink] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setShowResetLink(false);
    try {
      await apiService.forgotPassword(email);
      setMessage('If the email exists, a reset token has been sent to your email.');
      setShowResetLink(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">Enter your email to receive a reset token.</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {message && (
              <div className="text-green-600 mb-2">
                {message}
                {showResetLink && (
                  <>
                    <div className="mt-2 text-sm text-gray-700">Paste the token from your email on the next page to reset your password.</div>
                    <Link
                      to="/reset-password"
                      className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Click here to reset your password
                    </Link>
                  </>
                )}
              </div>
            )}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="elegant-input pl-12"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <button type="submit" className="premium-button w-full group">
              <div className="flex items-center justify-center">
                <span>Send Reset Link</span>
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

export default ForgotPassword;