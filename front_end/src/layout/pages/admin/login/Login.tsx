import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Kiểm tra trạng thái xác thực khi component được render
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/admin/overview');
    }
  }, [navigate]);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Thay thế bằng logic xác thực thực tế
    if (email === 'admin@gmail.com' && password === '1') {
      // Lưu trạng thái đăng nhập và chuyển hướng đến trang quản trị
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/overview');
    } else {
      setError('Tài khoản hoặc mật khẩu không đúng');
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl">Admin Login</h1>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4 flex justify-between items-center">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Đăng nhập
              </button>
              <a href="/forgot-password" className="text-blue-500">Quên mật khẩu?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;