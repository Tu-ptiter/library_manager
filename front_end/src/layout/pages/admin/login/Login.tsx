// src/layout/pages/admin/login/Login.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../../api/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/admin/overview');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginAdmin(username, password);
      if (response) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('userData', JSON.stringify(response));
        navigate('/admin/overview');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Lỗi đăng nhập');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-white text-2xl">Quản lý thư viện</h1>
        </div>
      </nav>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập Admin</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;