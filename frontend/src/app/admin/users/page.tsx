'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Shield, 
  Trash2, 
  Edit3,
  Search,
  ArrowLeft,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { User } from '@/types';

interface UserListItem {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: 'ADMIN' | 'USER';
}

export default function AdminUsersPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      
      if (response.status === 'success') {
        setUsers(response.users);
        console.log(`Loaded ${response.users.length} users`);
      } else {
        toast.error('Không thể tải danh sách users');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: number, newRole: 'ADMIN' | 'USER') => {
    try {
      const response = await api.updateUserRole(userId, newRole);
      
      if (response.status === 'success') {
        // Update user in state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        toast.success(`Đã cập nhật role thành ${newRole}`);
        setEditingUser(null);
      } else {
        toast.error(response.message || 'Không thể cập nhật role');
      }
    } catch (error: any) {
      console.error('Error updating user role:', error);
      const message = error.response?.data?.message || 'Có lỗi khi cập nhật role';
      toast.error(message);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await api.deleteUser(userId);
      
      if (response.status === 'success') {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('Đã xóa user thành công');
        setDeleteConfirm(null);
      } else {
        toast.error(response.message || 'Không thể xóa user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const message = error.response?.data?.message || 'Có lỗi khi xóa user';
      toast.error(message);
    }
  };

  // Filter users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      // Admin users first
      if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
      if (b.role === 'ADMIN' && a.role !== 'ADMIN') return 1;
      return a.username.localeCompare(b.username);
    });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không có quyền truy cập
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Link 
                href="/admin"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại Dashboard
              </Link>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Quản lý Users
                </h1>
                <p className="text-gray-600">
                  Tổng cộng {filteredUsers.length} users
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có user nào</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Không tìm thấy user phù hợp' : 'Chưa có user trong hệ thống'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thông tin liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              {user.role === 'ADMIN' ? (
                                <Crown className="h-5 w-5 text-yellow-600" />
                              ) : (
                                <UserCheck className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email || 'Chưa có email'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.phone || 'Chưa có SĐT'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role === 'ADMIN' ? (
                            <>
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              User
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Chỉnh sửa role"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {user.role !== 'ADMIN' && (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Xóa user"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Cập nhật Role User
              </h3>
              <div className="text-left mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>User:</strong> {editingUser.fullName} (@{editingUser.username})
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <strong>Role hiện tại:</strong> {editingUser.role}
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn role mới:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="USER"
                      defaultChecked={editingUser.role === 'USER'}
                      className="mr-2"
                    />
                    <UserCheck className="w-4 h-4 mr-1 text-green-600" />
                    User (Người dùng thường)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="ADMIN"
                      defaultChecked={editingUser.role === 'ADMIN'}
                      className="mr-2"
                    />
                    <Crown className="w-4 h-4 mr-1 text-yellow-600" />
                    Admin (Quản trị viên)
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const selectedRole = (document.querySelector('input[name="role"]:checked') as HTMLInputElement)?.value as 'ADMIN' | 'USER';
                    if (selectedRole && selectedRole !== editingUser.role) {
                      handleUpdateRole(editingUser.id, selectedRole);
                    } else {
                      setEditingUser(null);
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Cập nhật
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <UserX className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa user
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa user này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteUser(deleteConfirm)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 