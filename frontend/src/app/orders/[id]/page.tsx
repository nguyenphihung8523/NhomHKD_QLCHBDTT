'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !isLoading && params.id) {
      fetchOrder(Number(params.id));
    }
  }, [isAuthenticated, isLoading, params.id]);

  const fetchOrder = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Không thể tải thông tin đơn hàng');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-6 w-6 text-yellow-600" />;
      case 'CONFIRMED':
        return <CheckCircle className="h-6 w-6 text-blue-600" />;
      case 'SHIPPING':
        return <Truck className="h-6 w-6 text-purple-600" />;
      case 'DELIVERED':
        return <Package className="h-6 w-6 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Clock className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'SHIPPING':
        return 'Đang giao hàng';
      case 'DELIVERED':
        return 'Đã giao hàng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const calculateOrderTotal = () => {
    if (!order) return 0;
    return order.orderDetails.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleCancelOrder = async () => {
    if (!order || !confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      await api.cancelOrder(order.id);
      toast.success('Hủy đơn hàng thành công');
      // Refresh order data
      fetchOrder(order.id);
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const message = error.response?.data?.message || 'Không thể hủy đơn hàng';
      toast.error(message);
    }
  };

  if (isLoading || loading) {
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
            Vui lòng đăng nhập để xem đơn hàng
          </h1>
          <Link href="/auth/login" className="btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy đơn hàng
          </h1>
          <Link href="/orders" className="btn-primary">
            Quay lại danh sách đơn hàng
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
            href="/orders"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng #{order.id}
              </h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Đặt lúc: {formatDate(order.orderDate)}
                </span>
              </div>
            </div>
            {order.status === 'PENDING' && (
              <button
                onClick={handleCancelOrder}
                className="btn-secondary text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sản phẩm đã đặt
              </h3>
              
              <div className="space-y-4">
                {order.orderDetails.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0 w-20 h-20">
                      <Image
                        src={item.productImageUrl || '/placeholder-product.jpg'}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900">
                        {item.productName}
                      </h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {formatPrice(item.unitPrice)} × {item.quantity}
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-700 mb-2">Ghi chú đơn hàng:</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="text-gray-900">{formatPrice(calculateOrderTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-primary-600">{formatPrice(calculateOrderTotal())}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin giao hàng
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Package className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Người nhận</div>
                    <div className="text-gray-600">
                      {order.customer?.name || order.userAccount?.fullName}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Phone className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Số điện thoại</div>
                    <div className="text-gray-600">
                      {order.customer?.phone || order.userAccount?.phone}
                    </div>
                  </div>
                </div>

                {(order.customer?.email || order.userAccount?.email) && (
                  <div className="flex items-start space-x-2">
                    <Mail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-700">Email</div>
                      <div className="text-gray-600">
                        {order.customer?.email || order.userAccount?.email}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Địa chỉ giao hàng</div>
                    <div className="text-gray-600">
                      {order.customer?.address || order.userAccount?.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Trạng thái đơn hàng
              </h3>
              
              <div className="space-y-4">
                <div className={`flex items-center space-x-3 ${order.status !== 'CANCELLED' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${order.status !== 'CANCELLED' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Đã đặt hàng</span>
                </div>
                
                <div className={`flex items-center space-x-3 ${['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${['CONFIRMED', 'SHIPPING', 'DELIVERED'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Đã xác nhận</span>
                </div>
                
                <div className={`flex items-center space-x-3 ${['SHIPPING', 'DELIVERED'].includes(order.status) ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${['SHIPPING', 'DELIVERED'].includes(order.status) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Đang giao hàng</span>
                </div>
                
                <div className={`flex items-center space-x-3 ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">Đã giao hàng</span>
                </div>

                {order.status === 'CANCELLED' && (
                  <div className="flex items-center space-x-3 text-red-600 pt-2 border-t border-gray-200">
                    <XCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Đơn hàng đã bị hủy</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 