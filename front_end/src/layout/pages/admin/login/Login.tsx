import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/api/api';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.librarianId) {
        localStorage.setItem('adminData', JSON.stringify(data));
        toast.success('Đăng nhập thành công, đang chuyển hướng...');
        setTimeout(() => {
          navigate('/admin/overview');
        }, 2000); // 1 second delay
      }
    } catch (error) {
      if ((error as any).response?.status === 401) {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng.');
      } else {
        toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.');
      }
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/login/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Đăng nhập</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tài khoản</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[60%] transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <div className="flex justify-between items-center">
            <Button type="submit">Đăng nhập</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleForgotPassword}
            >
              Quên mật khẩu?
            </Button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;