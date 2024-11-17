import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getOtp, resetPassword } from '@/api/api';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // Import loading icon

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleGetOtp = async () => {
    if (countdown > 0) return;
    
    try {
      setIsLoading(true);
      await getOtp(username);
      toast.success('Gửi mã OTP thành công');
      setCountdown(60); // Start 60s countdown
    } catch (error) {
      toast.error((error as any).message || 'Không thể gửi mã OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(username, otp, newPassword);
      toast.success('Đổi mật khẩu thành công');
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      toast.error((error as any).message || 'Không thể đổi mật khẩu');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Quên mật khẩu</h1>
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <Button
              type="button"
              onClick={handleGetOtp}
              className="mt-6"
              variant="outline"
              disabled={isLoading || countdown > 0}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : countdown > 0 ? (
                `${countdown}s`
              ) : (
                'Gửi mã'
              )}
            </Button>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Mật khẩu mới
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              Quay lại
            </Button>
            <Button type="submit">
              Xác nhận
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;