import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/api/api';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, BookOpen, User, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await login(username, password);
      if (data.librarianId) {
        localStorage.setItem('adminData', JSON.stringify(data));
        toast.success('Đăng nhập thành công!', {
          duration: 3000,
          style: {
            background: '#22c55e',
            color: '#fff',
          },
        });
        setTimeout(() => {
          navigate('/admin/overview');
        }, 2000);
      }
    } catch (error) {
      if ((error as any).response?.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại sau', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/login/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo và Tiêu đề */}
          <div className="text-center space-y-2">
            <div className="inline-block p-4 bg-blue-50 rounded-full">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Đăng nhập Admin
            </h1>
            <p className="text-gray-500 text-sm">
              Vui lòng đăng nhập để tiếp tục
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
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

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300 transition-colors"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Quên mật khẩu */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Button đăng nhập */}
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
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </Button>
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

export default Login;