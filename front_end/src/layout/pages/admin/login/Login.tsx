
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/api/api';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      if (data.librarianId) {
        localStorage.setItem('adminData', JSON.stringify(data));
        navigate('/admin/overview');
      } else {
        setErrorMessage('Invalid credentials');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleForgotPassword = () => {
    navigate('/admin/login/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <Input
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full"
            />
          </div>
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <div className="flex justify-between items-center">
            <Button type="submit">Login</Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleForgotPassword}
            >
              Forgot Password
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};



export default Login;