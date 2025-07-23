'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Xóa sản phẩm thành công');
      setDeleteConfirm(null);
    } catch (error: any) {
      console.error('Error deleting product:', error);
      const message = error.response?.data?.message || 'Có lỗi khi xóa sản phẩm';
      toast.error(message);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
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
          <p className="text-gray-600 mb-6">
            Bạn cần có quyền admin để truy cập trang này
          </p>
          <Link href="/" className="btn-primary">
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
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/admin"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại Dashboard
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý sản phẩm
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý toàn bộ sản phẩm trong hệ thống
              </p>
            </div>
            
            <Link href="/admin/products/new" className="btn-primary">
              <Plus className="h-4 w-4 mr-2" />
              Thêm sản phẩm mới
            </Link>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span>Tổng: <strong>{products.length}</strong> sản phẩm</span>
              <span>Hiển thị: <strong>{filteredProducts.length}</strong></span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Thử tìm kiếm với từ khóa khác' 
                : 'Hãy tạo sản phẩm đầu tiên của bạn'
              }
            </p>
            {!searchTerm && (
              <Link href="/admin/products/new" className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm mới
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.imageUrl || '/placeholder-product.jpg'}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="text-lg font-bold text-primary-600 mb-1">
                      {formatPrice(product.price)}
                    </div>
                    <div className={`text-sm ${
                      product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.quantity > 0 
                        ? `Còn ${product.quantity} sản phẩm` 
                        : 'Hết hàng'
                      }
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 btn-secondary text-xs text-center flex items-center justify-center gap-1"
                      title="Xem sản phẩm"
                    >
                      <Eye className="h-3 w-3" />
                      Xem
                    </Link>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="flex-1 btn-primary text-xs text-center flex items-center justify-center gap-1"
                      title="Sửa sản phẩm"
                    >
                      <Edit className="h-3 w-3" />
                      Sửa
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center justify-center"
                      title="Xóa sản phẩm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Xác nhận xóa sản phẩm
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="btn-secondary"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={() => handleDeleteProduct(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 