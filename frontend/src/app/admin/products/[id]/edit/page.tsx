'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Save, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Product, UpdateProductRequest } from '@/types';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<UpdateProductRequest>({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !isLoading && params.id) {
      fetchProduct(Number(params.id));
    }
  }, [isAuthenticated, isAdmin, isLoading, params.id]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getProduct(id);
      setProduct(data);
      setFormData({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
        imageUrl: data.imageUrl,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên sản phẩm');
      return;
    }
    
    if (formData.price <= 0) {
      toast.error('Giá sản phẩm phải lớn hơn 0');
      return;
    }
    
    if (formData.quantity < 0) {
      toast.error('Số lượng không được âm');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updateProduct(Number(params.id), formData);
      toast.success('Cập nhật sản phẩm thành công');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error updating product:', error);
      const message = error.response?.data?.message || 'Có lỗi khi cập nhật sản phẩm';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || loading) {
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <Link href="/admin/products" className="btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/products"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách sản phẩm
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Sửa sản phẩm: {product.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật thông tin sản phẩm
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Xem trước sản phẩm
            </h3>
            
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={formData.imageUrl || '/placeholder-product.jpg'}
                  alt={formData.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {formData.name || 'Tên sản phẩm'}
                </h4>
                <p className="text-gray-600 mb-3">
                  {formData.description || 'Mô tả sản phẩm'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(formData.price || 0)}
                  </span>
                  <span className={`text-sm ${
                    formData.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formData.quantity > 0 
                      ? `Còn ${formData.quantity} sản phẩm` 
                      : 'Hết hàng'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thông tin sản phẩm
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Giá (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  URL ảnh sản phẩm
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://example.com/product-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống nếu không có ảnh (sẽ sử dụng ảnh mặc định)
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả sản phẩm <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field resize-none"
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Link
                  href="/admin/products"
                  className="flex-1 btn-secondary text-center"
                >
                  Hủy bỏ
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
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
    </div>
  );
} 