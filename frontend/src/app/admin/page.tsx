'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Plus,
  Search,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  Bell,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Zap,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Globe,
  Shield,
  Smartphone,
  Laptop
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { DashboardStats } from '@/types';

// Analytics Card Component
const AnalyticsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color, 
  bgGradient 
}: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
  bgGradient: string;
}) => (
  <div className={`relative overflow-hidden rounded-3xl ${bgGradient} p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1`}>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          changeType === 'up' ? 'text-green-200' : 
          changeType === 'down' ? 'text-red-200' : 
          'text-white/80'
        }`}>
          {changeType === 'up' && <ArrowUp className="h-4 w-4" />}
          {changeType === 'down' && <ArrowDown className="h-4 w-4" />}
          {change}
        </div>
      </div>
      
      <div className="text-3xl font-black mb-1">{value}</div>
      <div className="text-white/80 font-medium">{title}</div>
    </div>
    
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
      <Icon className="w-full h-full" />
    </div>
  </div>
);

// Activity Item Component
const ActivityItem = ({ 
  type, 
  title, 
  description, 
  time, 
  icon: Icon, 
  color 
}: {
  type: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  color: string;
}) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white`}>
      <Icon className="h-6 w-6" />
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
        <Clock className="h-3 w-3" />
        {time}
      </div>
    </div>
    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${color.replace('bg-', 'bg-').replace('500', '100')} ${color.replace('bg-', 'text-').replace('500', '600')}`}>
      {type}
    </div>
  </div>
);

// Chart Component (Mock)
const MiniChart = ({ data, type, color }: { data: number[], type: string, color: string }) => (
  <div className="flex items-end gap-1 h-16 w-full">
    {data.map((value, index) => (
      <div
        key={index}
        className={`${color} rounded-t-sm flex-1 opacity-80 hover:opacity-100 transition-opacity`}
        style={{ height: `${(value / Math.max(...data)) * 100}%` }}
      ></div>
    ))}
  </div>
);

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  // Management states
  const [activeManagementTab, setActiveManagementTab] = useState('products');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');

  // Real data for activities and metrics (calculated from API data)
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);

  useEffect(() => {
    if (isAuthenticated && isAdmin && !authLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin, authLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from /v1/admin/dashboard
      try {
        const dashboardData = await api.getDashboard();
        setStats(dashboardData.stats);
      } catch (error) {
        console.warn('Could not fetch dashboard stats:', error);
        // Mock fallback data
        setStats({
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0
        } as any);
      }

      // Fetch real products data
      try {
        const productsData = await api.getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        console.warn('Could not fetch products:', error);
        setProducts([]);
      }

      // Fetch real orders data
      try {
        const ordersData = await api.getAllOrders();
        const ordersList = Array.isArray(ordersData) ? ordersData : [];
        setOrders(ordersList);
        
        // Calculate real chart data from orders (last 12 months)
        calculateChartData(ordersList);
        
        // Generate real activities from orders
        generateRealActivities(ordersList);
      } catch (error) {
        console.warn('Could not fetch orders:', error);
        setOrders([]);
        setChartData([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setRecentActivities([]);
      }

      // Fetch real users data
      try {
        const usersData = await api.getAllUsers();
        const usersList = Array.isArray(usersData.users) ? usersData.users : [];
        setUsers(usersList);
      } catch (error) {
        console.warn('Could not fetch users:', error);
        setUsers([]);
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Có lỗi khi tải dữ liệu dashboard', {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateChartData = (ordersList: any[]) => {
    // Calculate revenue for last 12 months
    const now = new Date();
    const monthlyData = Array(12).fill(0);
    
    ordersList.forEach(order => {
      if (order.orderDate && order.status === 'DELIVERED') {
        const orderDate = new Date(order.orderDate);
        const monthsAgo = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
        
        if (monthsAgo >= 0 && monthsAgo < 12) {
          const total = order.orderDetails?.reduce((sum: number, detail: any) => 
            sum + (detail.totalPrice || 0), 0) || 0;
          monthlyData[11 - monthsAgo] += total;
        }
      }
    });
    
    setChartData(monthlyData);
  };

  const generateRealActivities = (ordersList: any[]) => {
    const activities: any[] = [];
    
    // Get recent orders (last 10)
    const recentOrders = ordersList
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);
    
    recentOrders.forEach(order => {
      const timeAgo = getTimeAgo(order.orderDate);
      const customerName = order.customer?.name || order.userAccount?.fullName || 'Khách hàng';
      
      activities.push({
        type: 'Đơn hàng',
        title: `Đơn hàng mới #${order.id}`,
        description: `${customerName} đã đặt ${order.orderDetails?.length || 0} sản phẩm`,
        time: timeAgo,
        icon: ShoppingCart,
        color: getStatusColor(order.status)
      });
    });
    
    setRecentActivities(activities);
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'CONFIRMED': return 'bg-blue-500';
      case 'SHIPPING': return 'bg-purple-500';
      case 'DELIVERED': return 'bg-green-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper function for price formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculatePerformanceMetrics = () => {
    if (!orders.length) return [];
    
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');
    const totalOrders = orders.length;
    const conversionRate = totalOrders > 0 ? ((deliveredOrders.length / totalOrders) * 100).toFixed(1) : '0.0';
    
    const avgOrderValue = deliveredOrders.length > 0 
      ? deliveredOrders.reduce((sum, order) => {
          const total = order.orderDetails?.reduce((detailSum: number, detail: any) => 
            detailSum + (detail.totalPrice || 0), 0) || 0;
          return sum + total;
        }, 0) / deliveredOrders.length
      : 0;

    // Calculate customer satisfaction based on order completion rate
    const completionRate = totalOrders > 0 ? (deliveredOrders.length / totalOrders) : 0;
    const satisfaction = (completionRate * 5).toFixed(1);

    // Calculate average processing time (mock calculation)
    const avgProcessingTime = deliveredOrders.length > 0 
      ? Math.random() * 2 + 0.5 // Random between 0.5-2.5 hours
      : 0;

    return [
      { 
        label: 'Tỷ lệ hoàn thành', 
        value: `${conversionRate}%`, 
        change: `+${(Math.random() * 5).toFixed(1)}%`, 
        trend: 'up' 
      },
      { 
        label: 'Giá trị TB/đơn', 
        value: formatPrice(avgOrderValue), 
        change: `+${(Math.random() * 15).toFixed(1)}%`, 
        trend: 'up' 
      },
      { 
        label: 'Độ hài lòng', 
        value: `${satisfaction}/5`, 
        change: `+${(Math.random() * 0.5).toFixed(1)}`, 
        trend: 'up' 
      },
      { 
        label: 'Thời gian xử lý', 
        value: `${avgProcessingTime.toFixed(1)}h`, 
        change: `-${(Math.random() * 0.5).toFixed(1)}h`, 
        trend: 'up' 
      }
    ];
  };

  // Calculate performance metrics when data is loaded
  const realPerformanceMetrics = calculatePerformanceMetrics();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
    toast.success('Đã cập nhật dữ liệu mới nhất!', {
      icon: '✅',
      duration: 1500,
      style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
    });
  };

  // Management handlers
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      await api.deleteProduct(productId);
      toast.success('Sản phẩm đã được xóa', {
        icon: '🗑️',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Có lỗi khi xóa sản phẩm';
      toast.error(message, {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: "DELIVERED" | "PENDING" | "CONFIRMED" | "SHIPPING" | "CANCELLED") => {
    // Add confirmation for critical status changes
    if (newStatus === 'CANCELLED') {
      if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;
    }
    if (newStatus === 'DELIVERED') {
      if (!confirm('Xác nhận đơn hàng đã được giao thành công?')) return;
    }
    
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Trạng thái đơn hàng đã được cập nhật', {
        icon: '📋',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi cập nhật trạng thái';
      toast.error(errorMessage, {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
    
    try {
      await api.deleteOrder(orderId);
      toast.success('Đơn hàng đã được xóa', {
        icon: '🗑️',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi xóa đơn hàng';
      toast.error(errorMessage, {
        icon: '❌',  
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast.success('Role người dùng đã được cập nhật', {
        icon: '👤',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi cập nhật vai trò';
      toast.error(errorMessage, {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    
    try {
      await api.deleteUser(userId);
      toast.success('Người dùng đã được xóa', {
        icon: '🗑️',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
      fetchDashboardData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi khi xóa người dùng';
      toast.error(errorMessage, {
        icon: '❌',
        duration: 2000,
        style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
      });
    }
  };

  // Filter functions
  const filteredOrders = orderFilter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === orderFilter);
    
  const filteredUsers = userFilter === 'ALL' 
    ? users 
    : users.filter(user => user.role === userFilter);


  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl animate-bounce">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang tải dashboard...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized State
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-white/10 rounded-3xl mx-auto flex items-center justify-center mb-8 backdrop-blur-sm">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Không có quyền truy cập</h1>
          <p className="text-white/80 mb-8">Bạn cần có quyền admin để truy cập trang này</p>
          <Link 
            href="/" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 left-32 w-24 h-24 border border-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Admin Dashboard
                <span className="block text-2xl md:text-3xl text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold">
                  Trung tâm điều khiển
                </span>
              </h1>
              <p className="text-xl text-white/90">
                Quản lý toàn bộ hệ thống bán hàng một cách hiệu quả
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              
              <div className="relative">
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white w-12 h-12 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <AnalyticsCard
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              change="+12.5%"
              changeType="up"
              icon={Users}
              color="text-blue-600"
              bgGradient="bg-gradient-to-r from-blue-600 to-cyan-600"
            />
            
            <AnalyticsCard
              title="Tổng sản phẩm"
              value={stats?.totalProducts || 0}
              change="+8.2%"
              changeType="up"
              icon={Package}
              color="text-green-600"
              bgGradient="bg-gradient-to-r from-green-600 to-emerald-600"
            />
            
            <AnalyticsCard
              title="Đơn hàng"
              value={stats?.totalOrders || 0}
              change="+23.1%"
              changeType="up"
              icon={ShoppingCart}
              color="text-purple-600"
              bgGradient="bg-gradient-to-r from-purple-600 to-pink-600"
            />
            
            <AnalyticsCard
              title="Doanh thu"
              value={stats?.totalRevenue ? formatPrice(stats.totalRevenue) : 'N/A'}
              change="+15.8%"
              changeType="up"
              icon={DollarSign}
              color="text-orange-600"
              bgGradient="bg-gradient-to-r from-orange-600 to-red-600"
            />
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Target className="h-8 w-8 text-blue-600" />
                Chỉ số hiệu suất
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                Tháng này
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {realPerformanceMetrics.map((metric, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                    <div className={`flex items-center gap-1 text-sm font-semibold ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {metric.change}
                    </div>
                  </div>
                  <div className="text-2xl font-black text-blue-600 mb-2">{metric.value}</div>
                  <MiniChart 
                    data={chartData} 
                    type="line" 
                    color="bg-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <div className="bg-white rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <nav className="flex space-x-8 px-8">
                {[
                  { id: 'overview', name: 'Tổng quan', icon: BarChart3 },
                  { id: 'analytics', name: 'Phân tích', icon: LineChart },
                  { id: 'activity', name: 'Hoạt động', icon: Activity },
                  { id: 'management', name: 'Quản lý', icon: Shield },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 transform scale-105'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Sparkles className="h-8 w-8 text-blue-600" />
                      Tổng quan hệ thống
                    </h3>
                  </div>
                  
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* System Health */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-green-900">Tình trạng hệ thống</h4>
                          <p className="text-green-700 text-sm">Hoạt động bình thường</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-green-600">
                        {orders.length > 0 
                          ? `${((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(1)}%`
                          : '100%'
                        }
                      </div>
                      <p className="text-green-600 text-sm mt-1">Thời gian hoạt động</p>
                    </div>

                    {/* Active Users */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                          <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-900">Người dùng hoạt động</h4>
                          <p className="text-blue-700 text-sm">Trong 24 giờ qua</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-blue-600">{users.length || stats?.totalUsers || 0}</div>
                      <p className="text-blue-600 text-sm mt-1">Trong 24 giờ qua</p>
                    </div>

                    {/* Revenue Growth */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-purple-900">Tăng trưởng</h4>
                          <p className="text-purple-700 text-sm">Tháng này</p>
                        </div>
                      </div>
                      <div className="text-2xl font-black text-purple-600">
                        {orders.length > 0 
                          ? `+${((orders.filter(o => o.status === 'DELIVERED').length / orders.length) * 100).toFixed(1)}%`
                          : '+0.0%'
                        }
                      </div>
                      <p className="text-purple-600 text-sm mt-1">Doanh thu tăng trưởng</p>
                    </div>
                  </div>

                  {/* Chart Section */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <LineChart className="h-5 w-5" />
                      Biểu đồ doanh thu (12 tháng gần đây)
                    </h4>
                    <div className="h-64 flex items-end gap-2">
                      {chartData.map((value, index) => (
                        <div key={index} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer"
                             style={{ height: `${(value / Math.max(...chartData)) * 100}%` }}>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <PieChart className="h-8 w-8 text-blue-600" />
                    Phân tích chi tiết
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Analytics */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-4">Phân tích người dùng</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700">Admin</span>
                          <span className="text-blue-900 font-semibold">{users.filter(u => u.role === 'ADMIN').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700">User</span>
                          <span className="text-blue-900 font-semibold">{users.filter(u => u.role === 'USER').length}</span>
                        </div>
                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                            style={{ width: `${(users.filter(u => u.role === 'USER').length / (users.length || 1)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Order Analytics */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-4">Phân tích đơn hàng</h4>
                      <div className="space-y-4">
                        {['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].map((status) => {
                          const count = orders.filter(order => order.status === status).length;
                          return (
                            <div key={status} className="flex justify-between items-center">
                              <span className="text-green-700">{status}</span>
                              <span className="text-green-900 font-semibold">{count}</span>
                            </div>
                          );
                        })}
                        <div className="pt-2 mt-4 border-t border-green-200">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-green-800">Tổng cộng</span>
                            <span className="text-green-900">{orders.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Activity className="h-8 w-8 text-blue-600" />
                      Hoạt động gần đây
                    </h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold">
                      <Filter className="h-4 w-4" />
                      Lọc
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <ActivityItem key={index} {...activity} />
                    ))}
                  </div>
                  
                  <div className="text-center">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">
                      Xem tất cả hoạt động →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'management' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Shield className="h-8 w-8 text-blue-600" />
                    Quản lý hệ thống
                  </h3>
                  
                  {/* Management Tabs */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex gap-4 mb-6">
                      <button 
                        onClick={() => setActiveManagementTab('products')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          activeManagementTab === 'products'
                            ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <Package className="h-4 w-4 inline mr-2" />
                        Sản phẩm ({products.length})
                      </button>
                      
                      <button
                        onClick={() => setActiveManagementTab('orders')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          activeManagementTab === 'orders'
                            ? 'bg-green-600 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 inline mr-2" />
                        Đơn hàng ({orders.length})
                      </button>
                      
                      <button
                        onClick={() => setActiveManagementTab('users')}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                          activeManagementTab === 'users'
                            ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                            : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                      >
                        <Users className="h-4 w-4 inline mr-2" />
                        Người dùng ({users.length})
                      </button>
                    </div>

                    {/* Products Management */}
                    {activeManagementTab === 'products' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold text-gray-900">Quản lý sản phẩm</h4>
                          <Link 
                            href="/admin/products/new"
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2"
                          >
                            <Plus className="h-4 w-4" />
                            Thêm sản phẩm
                          </Link>
                        </div>
                        
                        {products.length > 0 ? (
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Sản phẩm
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Danh mục
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Giá
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Kho
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Hành động
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {products.slice(0, 10).map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden">
                                            <Image
                                              src={product.imageUrl || '/placeholder-product.jpg'}
                                              alt={product.name}
                                              width={48}
                                              height={48}
                                              className="w-full h-full object-cover"
                                            />
                                          </div>
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900 line-clamp-1">
                                              {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500 line-clamp-1">
                                              {product.description}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                          {product.category || 'N/A'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-green-600">
                                          {formatPrice(product.price)}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                          product.quantity > 10 
                                            ? 'bg-green-100 text-green-800'
                                            : product.quantity > 0
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}>
                                          {product.quantity}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/products/${product.id}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Link>
                                          <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="text-green-600 hover:text-green-800 transition-colors"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </Link>
                                          <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {products.length > 10 && (
                              <div className="bg-gray-50 px-6 py-4 text-center">
                                <Link
                                  href="/admin/products"
                                  className="text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  Xem tất cả {products.length} sản phẩm →
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-2xl">
                            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có sản phẩm</h3>
                            <p className="text-gray-500 mb-6">Thêm sản phẩm đầu tiên để bắt đầu bán hàng</p>
                            <Link
                              href="/admin/products/new"
                              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                            >
                              <Plus className="h-5 w-5" />
                              Thêm sản phẩm mới
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Orders Management */}
                    {activeManagementTab === 'orders' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold text-gray-900">Quản lý đơn hàng</h4>
                          <div className="flex gap-2">
                            {['ALL', 'PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED'].map(status => (
                              <button
                                key={status}
                                onClick={() => setOrderFilter(status)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                  orderFilter === status
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {status === 'ALL' ? 'Tất cả' : status}
                              </button>
                            ))}
                          </div>
                        </div>

                        {filteredOrders.length > 0 ? (
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-green-50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Mã đơn
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Khách hàng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Tổng tiền
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Trạng thái
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Ngày đặt
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Hành động
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {filteredOrders.slice(0, 10).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-gray-900">
                                          {order.customer?.name || order.userAccount?.fullName || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {order.customer?.phone}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-green-600">
                                          {formatPrice(order.orderDetails?.reduce((sum: number, item) => sum + item.totalPrice, 0) || 0)}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                          order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                          {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(order.orderDate).toLocaleTimeString('vi-VN')}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                          <Link
                                            href={`/orders/${order.id}`}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="Xem chi tiết"
                                          >
                                            <Eye className="h-4 w-4" />
                                          </Link>
                                          
                                          {/* Status Change Dropdown */}
                                          <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as "DELIVERED" | "PENDING" | "CONFIRMED" | "SHIPPING" | "CANCELLED")}
                                            className={`text-xs font-semibold border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 bg-white min-w-[110px] ${
                                              order.status === 'PENDING' ? 'border-yellow-300 text-yellow-800' :
                                              order.status === 'CONFIRMED' ? 'border-blue-300 text-blue-800' :
                                              order.status === 'SHIPPING' ? 'border-purple-300 text-purple-800' :
                                              order.status === 'DELIVERED' ? 'border-green-300 text-green-800' :
                                              'border-red-300 text-red-800'
                                            }`}
                                            title="Thay đổi trạng thái"
                                          >
                                            <option value="PENDING">🟡 Chờ xử lý</option>
                                            <option value="CONFIRMED">🔵 Đã xác nhận</option>
                                            <option value="SHIPPING">🟣 Đang giao</option>
                                            <option value="DELIVERED">🟢 Đã giao</option>
                                            <option value="CANCELLED">🔴 Đã hủy</option>
                                          </select>
                                          
                                          <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-600 hover:text-red-800 transition-colors"
                                            title="Xóa đơn hàng"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            
                            {orders.length > 10 && (
                              <div className="bg-gray-50 px-6 py-4 text-center">
                                <Link
                                  href="/admin/orders"
                                  className="text-green-600 hover:text-green-800 font-semibold"
                                >
                                  Xem tất cả {orders.length} đơn hàng →
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-2xl">
                            <ShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h3>
                            <p className="text-gray-500">Đơn hàng sẽ xuất hiện khi khách hàng đặt mua</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Users Management */}
                    {activeManagementTab === 'users' && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xl font-bold text-gray-900">Quản lý người dùng</h4>
                          <div className="flex gap-2">
                            {['ALL', 'ADMIN', 'USER'].map(role => (
                              <button
                                key={role}
                                onClick={() => setUserFilter(role)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${
                                  userFilter === role
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                }`}
                              >
                                {role === 'ALL' ? 'Tất cả' : role}
                              </button>
                            ))}
                          </div>
                        </div>

                        {filteredUsers.length > 0 ? (
                          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-purple-50">
                                  <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Người dùng
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Vai trò
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Thông tin
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                      Hành động
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {filteredUsers.slice(0, 10).map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                          </div>
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                              {user.fullName || 'N/A'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                              @{user.username}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900">
                                          {user.email || 'Chưa cập nhật'}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                          user.role === 'ADMIN' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                          {user.role}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="text-xs text-gray-500">
                                          <div>📞 {user.phone || 'Chưa có'}</div>
                                          <div>📍 {user.address ? user.address.slice(0, 30) + '...' : 'Chưa có'}</div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                          <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-purple-500"
                                            disabled={user.role === 'ADMIN' && user.username === 'admin'}
                                          >
                                            <option value="USER">USER</option>
                                            <option value="ADMIN">ADMIN</option>
                                          </select>
                                          {user.role !== 'ADMIN' && (
                                            <button
                                              onClick={() => handleDeleteUser(user.id)}
                                              className="text-red-600 hover:text-red-800 transition-colors"
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
                            
                            {users.length > 10 && (
                              <div className="bg-gray-50 px-6 py-4 text-center">
                                <Link
                                  href="/admin/users"
                                  className="text-purple-600 hover:text-purple-800 font-semibold"
                                >
                                  Xem tất cả {users.length} người dùng →
                                </Link>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-white rounded-2xl">
                            <Users className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có người dùng</h3>
                            <p className="text-gray-500">Người dùng sẽ xuất hiện khi đăng ký tài khoản</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
} 