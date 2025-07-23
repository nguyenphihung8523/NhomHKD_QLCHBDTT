'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(Number(params.id));
    }
  }, [params.id]);

  const fetchProduct = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải thông tin sản phẩm');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.quantity <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    
    if (quantity > product.quantity) {
      toast.error(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
      return;
    }
    
    addToCart(product, quantity);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.quantity) {
      toast.error(`Chỉ còn ${product.quantity} sản phẩm trong kho`);
      return;
    }
    setQuantity(newQuantity);
  };

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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sản phẩm
          </h1>
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md">
              <Image
                src={product.imageUrl || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                </div>
                <span className="text-sm text-gray-600">(5.0 - 1,234 đánh giá)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatPrice(product.price)}
                </div>
                <div className={`text-lg ${
                  product.quantity > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.quantity > 0 
                    ? `Còn ${product.quantity} sản phẩm` 
                    : 'Hết hàng'
                  }
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Mô tả sản phẩm
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selection */}
              {product.quantity > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Số lượng
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[4rem] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                        disabled={quantity >= product.quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Tối đa: {product.quantity} sản phẩm
                    </span>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0}
                  className="w-full btn-primary text-lg py-3 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Dịch vụ của chúng tôi
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Truck className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span>Miễn phí vận chuyển toàn quốc cho đơn hàng trên 500.000đ</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Shield className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <RotateCcw className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <span>Đổi trả trong 30 ngày nếu không hài lòng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Sản phẩm liên quan
          </h2>
          <div className="text-center text-gray-500">
            <p>Tính năng sản phẩm liên quan sẽ được cập nhật sau</p>
          </div>
        </div>
      </div>
    </div>
  );
} 