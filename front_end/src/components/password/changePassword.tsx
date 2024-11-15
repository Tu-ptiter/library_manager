import React, { useState } from 'react';
import { changePassword } from '@/api/api';

interface ChangePasswordProps {
  onClose: () => void;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      const adminData = localStorage.getItem('adminData');
      if (!adminData) return;
      
      const { username } = JSON.parse(adminData);
      const response = await changePassword(username, oldPassword, newPassword);
      
      setMessage(response);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
        <input
          type="password"
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3"
        />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg mb-3"
        />
        {message && (
          <p className={`text-sm ${message.includes('lỗi') ? 'text-red-500' : 'text-green-500'} mb-3`}>
            {message}
          </p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;