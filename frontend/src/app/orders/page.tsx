'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShoppingBag, 
  Calendar, 
  Package, 
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Eye,
  X,
  CreditCard,
  MapPin,
  Star,
  Filter,
  Search,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Order } from '@/types';

// Loading Skeleton Component
const OrderSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
      </div>
      
      <div className="space-y-4 mb-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-16 w-16 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded-xl w-32"></div>
      </div>
    </div>
  </div>
);

// Enhanced Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          text: 'Chờ xác nhận',
          icon: Clock,
          color: 'from-yellow-400 to-orange-400',
          bg: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-200'
        };
      case 'CONFIRMED':
        return {
          text: 'Đã xác nhận',
          icon: CheckCircle,
          color: 'from-blue-400 to-cyan-400',
          bg: 'from-blue-50 to-cyan-50',
          border: 'border-blue-200'
        };
      case 'SHIPPING':
        return {
          text: 'Đang giao hàng',
          icon: Truck,
          color: 'from-purple-400 to-pink-400',
          bg: 'from-purple-50 to-pink-50',
          border: 'border-purple-200'
        };
      case 'DELIVERED':
        return {
          text: 'Đã giao hàng',
          icon: CheckCircle,
          color: 'from-green-400 to-emerald-400',
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-200'
        };
      case 'CANCELLED':
        return {
          text: 'Đã hủy',
          icon: XCircle,
          color: 'from-red-400 to-pink-400',
          bg: 'from-red-50 to-pink-50',
          border: 'border-red-200'
        };
      default:
        return {
          text: status,
          icon: Package,
          color: 'from-gray-400 to-gray-500',
          bg: 'from-gray-50 to-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.bg} border ${config.border} font-semibold text-sm shadow-sm`}>
      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color} animate-pulse`}></div>
      <Icon className="h-4 w-4" />
      <span>{config.text}</span>
    </div>
  );
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, isLoading, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getMyOrders(filterStatus || undefined);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = (order: Order) => {
    return order.orderDetails?.reduce((total, item) => total + (item.totalPrice || 0), 0) || 0;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    try {
      await api.cancelOrder(orderId);
      toast.success('Đã hủy đơn hàng thành công!', {
        icon: '✅',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchOrders();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const message = error.response?.data?.error || 'Không thể hủy đơn hàng';
      toast.error(message, {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'PENDING').length,
      completed: orders.filter(o => o.status === 'DELIVERED').length,
      shipping: orders.filter(o => o.status === 'SHIPPING').length
    };
  };

  const stats = getOrderStats();

  // Loading State
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                <ShoppingBag className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang tải đơn hàng...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mt-12">
              {[...Array(6)].map((_, i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Authenticated State
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-white/10 rounded-3xl mx-auto flex items-center justify-center mb-8 backdrop-blur-sm">
            <ShoppingBag className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Vui lòng đăng nhập</h1>
          <p className="text-white/80 mb-8">Bạn cần đăng nhập để xem danh sách đơn hàng của mình</p>
          <Link 
            href="/auth/login" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            Đăng nhập ngay
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <Link 
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay về trang chủ
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Đơn hàng của tôi
              </h1>
              <p className="text-xl text-white/90 mb-8 md:mb-0">
                Theo dõi trạng thái và lịch sử mua hàng
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Tổng đơn', value: stats.total, icon: Package, color: 'bg-white/20' },
                { label: 'Chờ xử lý', value: stats.pending, icon: Clock, color: 'bg-yellow-400/20' },
                { label: 'Đang giao', value: stats.shipping, icon: Truck, color: 'bg-purple-400/20' },
                { label: 'Hoàn thành', value: stats.completed, icon: CheckCircle, color: 'bg-green-400/20' }
              ].map((stat, index) => (
                <div key={index} className={`${stat.color} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
                  <stat.icon className="h-6 w-6 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search and Filter Bar */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Filter className="h-5 w-5" />
                Lọc đơn hàng
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setFilterStatus('')}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                      filterStatus === '' 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 inline mr-2" />
                    Tất cả
                  </button>
                  {[
                    { status: 'PENDING', label: 'Chờ xác nhận', color: 'from-yellow-500 to-orange-500' },
                    { status: 'CONFIRMED', label: 'Đã xác nhận', color: 'from-blue-500 to-cyan-500' },
                    { status: 'SHIPPING', label: 'Đang giao', color: 'from-purple-500 to-pink-500' },
                    { status: 'DELIVERED', label: 'Hoàn thành', color: 'from-green-500 to-emerald-500' },
                    { status: 'CANCELLED', label: 'Đã hủy', color: 'from-red-500 to-pink-500' }
                  ].map((item) => (
                    <button
                      key={item.status}
                      onClick={() => setFilterStatus(item.status)}
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        filterStatus === item.status
                          ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-8">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có đơn hàng nào</h3>
              <p className="text-gray-600 mb-8">Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên của bạn</p>
              <Link 
                href="/products"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3"
              >
                Mua sắm ngay
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredOrders.map((order, index) => (
                <div 
                  key={order.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Order Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Đơn hàng #{order.id}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.orderDetails?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center overflow-hidden">
                            {item.product?.imageUrl ? (
                              <Image
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 line-clamp-1">
                              {item.product?.name || 'Sản phẩm'}
                            </h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>SL: {item.quantity}</span>
                              <span className="font-semibold text-blue-600">
                                {formatPrice(item.totalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(order.orderDetails?.length || 0) > 2 && (
                        <div className="text-center text-gray-500 text-sm py-2">
                          +{(order.orderDetails?.length || 0) - 2} sản phẩm khác
                        </div>
                      )}
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{order.customer?.name || order.userAccount?.fullName}</div>
                          <div className="text-sm text-gray-600">{order.customer?.phone}</div>
                          <div className="text-sm text-gray-600 line-clamp-2">{order.customer?.address}</div>
                        </div>
                      </div>
                    </div>

                    {/* Order Footer */}
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        {formatPrice(calculateOrderTotal(order))}
                      </div>
                      
                      <div className="flex gap-3">
                        <Link
                          href={`/orders/${order.id}`}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2 text-sm font-semibold"
                        >
                          <Eye className="h-4 w-4" />
                          Xem chi tiết
                        </Link>
                        
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="border-2 border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 text-sm font-semibold"
                          >
                            <X className="h-4 w-4" />
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 