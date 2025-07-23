'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { ProfileUpdateRequest, ProfileStatus } from '@/types';

export default function ProfilePage() {
  const { user, refreshUserData, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      fetchProfileStatus();
    }
    setLoading(false);
  }, [isAuthenticated, user]);

  const fetchProfileStatus = async () => {
    try {
      const status = await api.getProfileStatus();
      setProfileStatus(status);
    } catch (error) {
      console.error('Error fetching profile status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error('Vui lòng nhập họ và tên');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: ProfileUpdateRequest = {};
      
      // Only send changed fields
      if (formData.fullName !== (user?.fullName || '')) {
        updateData.fullName = formData.fullName.trim();
      }
      if (formData.email !== (user?.email || '')) {
        updateData.email = formData.email.trim();
      }
      if (formData.phone !== (user?.phone || '')) {
        updateData.phone = formData.phone.trim();
      }
      if (formData.address !== (user?.address || '')) {
        updateData.address = formData.address.trim();
      }

      if (Object.keys(updateData).length === 0) {
        toast.success('Không có thay đổi nào cần lưu');
        return;
      }

      await api.updateProfile(updateData);
      await refreshUserData();
      await fetchProfileStatus();
      
      toast.success('Cập nhật thông tin thành công!');
    } catch (error: any) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập để truy cập trang này
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Hồ sơ cá nhân
            </h1>
            <p className="text-gray-600 mt-1">
              Cập nhật thông tin cá nhân của bạn
            </p>
          </div>

          {/* Profile Status */}
          {profileStatus && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className={`p-4 rounded-lg ${
                profileStatus.profileComplete 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${
                    profileStatus.profileComplete ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className={`text-sm font-medium ${
                      profileStatus.profileComplete ? 'text-green-800' : 'text-yellow-800'
                    }`}>
                      {profileStatus.profileComplete 
                        ? 'Hồ sơ đã hoàn thành' 
                        : 'Hồ sơ chưa hoàn thành'
                      }
                    </h3>
                    <div className={`mt-2 text-sm ${
                      profileStatus.profileComplete ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      <p>{profileStatus.message}</p>
                      {!profileStatus.profileComplete && (
                        <ul className="mt-2 list-disc list-inside space-y-1">
                          {!profileStatus.hasAddress && <li>Vui lòng cập nhật địa chỉ</li>}
                          {!profileStatus.hasPhone && <li>Vui lòng cập nhật số điện thoại</li>}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={user?.username || ''}
                    disabled
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cần thiết để liên lạc khi giao hàng</p>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Nhập địa chỉ giao hàng"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Địa chỉ này sẽ được sử dụng để giao hàng</p>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 