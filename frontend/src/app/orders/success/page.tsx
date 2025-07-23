'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Package, Truck, Phone } from 'lucide-react';

export default function OrderSuccessPage() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      window.location.href = '/orders';
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vui lòng đăng nhập
          </h1>
          <Link href="/auth/login" className="btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công! 🎉
          </h1>
          
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã mua sắm tại <strong>SportStore</strong>. 
            Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
          </p>

          {/* What happens next */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">
              Điều gì sẽ xảy ra tiếp theo?
            </h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-blue-600" />
                <span>Chúng tôi sẽ chuẩn bị đơn hàng trong vòng 1-2 giờ</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>Nhân viên sẽ gọi điện xác nhận đơn hàng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-600" />
                <span>Giao hàng trong vòng 1-3 ngày làm việc</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-sm text-yellow-800">
              <strong>Lưu ý thanh toán:</strong>
              <br />
              Nếu bạn chọn thanh toán COD, vui lòng chuẩn bị tiền mặt khi nhận hàng.
              Với các phương thức khác, chúng tôi sẽ hướng dẫn chi tiết qua điện thoại.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/orders"
              className="w-full btn-primary text-center block"
            >
              Xem đơn hàng của tôi
            </Link>
            
            <Link
              href="/"
              className="w-full btn-secondary text-center block"
            >
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Auto redirect notice */}
          <p className="text-xs text-gray-500 mt-4">
            Trang này sẽ tự động chuyển đến danh sách đơn hàng sau 10 giây
          </p>
        </div>

        {/* Contact Support */}
        <div className="mt-6 text-center">
          <p className="text-sm text-green-700">
            Cần hỗ trợ? Liên hệ hotline: <strong>1900 xxxx</strong>
          </p>
        </div>
      </div>
    </div>
  );
} 