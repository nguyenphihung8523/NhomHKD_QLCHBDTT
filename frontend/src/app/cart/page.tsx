'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CreditCard, Banknote, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      router.push('/auth/login');
      return;
    }

    if (cart.items.length === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if user profile is complete
      const profileStatus = await api.getProfileStatus();
      if (!profileStatus.profileComplete) {
        toast.error('Vui lòng cập nhật địa chỉ và số điện thoại trong hồ sơ cá nhân trước khi đặt hàng');
        router.push('/profile');
        return;
      }

      // Create order
      const orderData = {
        notes: `Đặt hàng từ website SportStore - Thanh toán: ${paymentMethod === 'cod' ? 'Tiền mặt khi nhận hàng' : paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' : 'Ví điện tử'}`,
        items: cart.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const order = await api.createOrder(orderData);
      clearCart();
      
      // Show success message and redirect to success page
      toast.success('Đặt hàng thành công! Đang chuyển đến trang xác nhận...');
      
      // Small delay to show the toast
      setTimeout(() => {
        router.push('/orders/success');
      }, 1500);
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-gray-600 mb-8">
            Hãy khám phá các sản phẩm thể thao tuyệt vời của chúng tôi
          </p>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tiếp tục mua sắm
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          <p className="text-gray-600 mt-2">{cart.itemCount} sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.product.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-20 h-20">
                      <Image
                        src={item.product.imageUrl || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link 
                          href={`/products/${item.product.id}`}
                          className="hover:text-primary-600"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.product.description}
                      </p>
                      <p className="text-lg font-semibold text-primary-600 mt-2">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg"
                          disabled={item.quantity >= item.product.quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Còn lại: {item.product.quantity} sản phẩm
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(cart.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-primary-600">{formatPrice(cart.total)}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Phương thức thanh toán
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <CreditCard className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Tiền mặt khi nhận hàng (COD)
                      </div>
                      <div className="text-xs text-gray-500">
                        Thanh toán khi nhận được hàng
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <Banknote className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Chuyển khoản ngân hàng
                      </div>
                      <div className="text-xs text-gray-500">
                        Chuyển khoản trước khi giao hàng
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ewallet"
                      checked={paymentMethod === 'ewallet'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <Wallet className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        Ví điện tử (MoMo, ZaloPay)
                      </div>
                      <div className="text-xs text-gray-500">
                        Thanh toán qua ví điện tử
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Vui lòng đăng nhập để tiến hành đặt hàng
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isSubmitting || !isAuthenticated}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Đặt hàng ngay
                  </>
                )}
              </button>

              {!isAuthenticated && (
                <div className="mt-4 space-y-2">
                  <Link href="/auth/login" className="w-full btn-outline block text-center">
                    Đăng nhập
                  </Link>
                  <Link href="/auth/register" className="w-full btn-secondary block text-center">
                    Tạo tài khoản mới
                  </Link>
                </div>
              )}
              
              <button
                onClick={clearCart}
                className="w-full mt-4 text-sm text-red-600 hover:text-red-800 underline"
              >
                Xóa tất cả sản phẩm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 