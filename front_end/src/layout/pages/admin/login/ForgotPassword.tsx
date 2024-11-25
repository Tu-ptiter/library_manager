import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getOtp, resetPassword } from '@/api/api';
import { Toaster } from 'react-hot-toast';
import { BookOpen, User, KeyRound, Timer, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetOtp = async () => {
    if (!username) {
      toast.error('Vui lòng nhập tên đăng nhập');
      return;
    }

    try {
      setIsLoading(true);
      await getOtp(username);
      setCountdown(60);
      toast.success('Mã OTP đã được gửi!');
    } catch (error) {
      toast.error('Không thể gửi mã OTP. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !otp || !newPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(username, otp, newPassword);
      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/admin/login'), 2000);
    } catch (error) {
      toast.error('Không thể đặt lại mật khẩu. Vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo và Tiêu đề */}
          <div className="text-center space-y-2">
            <div className="inline-block p-4 bg-blue-50 rounded-full">
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quên mật khẩu
            </h1>
            <p className="text-gray-500 text-sm">
              Nhập thông tin để đặt lại mật khẩu
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* Input Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            {/* Input OTP */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Mã OTP
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Timer className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                    placeholder="Nhập mã OTP"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetOtp}
                  disabled={isLoading || countdown > 0}
                  className="min-w-[120px] bg-white hover:bg-gray-50"
                >
                  {countdown > 0 ? `${countdown}s` : 'Gửi mã'}
                </Button>
              </div>
            </div>

            {/* Input New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Mật khẩu mới
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
                  transition-all duration-200 relative ${isLoading ? 'opacity-90' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/login')}
                className="w-full h-11 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Library Management System. All rights reserved.
        </p>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default ForgotPassword;