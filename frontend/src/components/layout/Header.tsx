'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import api from '@/lib/api';
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Search,
  LogOut,
  Settings,
  Package,
  ShoppingBag,
  Home,
  Shield,
  Sparkles,
  Zap,
  Award,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';

// Hook for server status
const useServerStatus = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [responseTime, setResponseTime] = useState<number>(0);

  const checkServerStatus = async () => {
    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      setStatus('checking');
      
      // Ping server health endpoint
      const response = await fetch('http://localhost:8082/api/actuator/health', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Server check timeout');
      }
      setStatus('offline');
    }
    setLastChecked(new Date());
  };

  useEffect(() => {
    // Check immediately on mount
    checkServerStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, lastChecked, responseTime, checkServerStatus };
};

// Server Status Component
const ServerStatus = () => {
  const { status, responseTime, checkServerStatus } = useServerStatus();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  // Update current time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          color: 'bg-green-500',
          text: 'Trực tuyến',
          textColor: 'text-green-600',
          bgColor: 'hover:bg-green-50',
          borderColor: 'border-green-200',
          icon: Wifi
        };
      case 'offline':
        return {
          color: 'bg-red-500',
          text: 'Ngoại tuyến', 
          textColor: 'text-red-600',
          bgColor: 'hover:bg-red-50',
          borderColor: 'border-red-200',
          icon: WifiOff
        };
      case 'checking':
        return {
          color: 'bg-yellow-500 animate-pulse',
          text: 'Kiểm tra',
          textColor: 'text-yellow-600',
          bgColor: 'hover:bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Zap
        };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border transition-all duration-300 cursor-pointer transform hover:scale-105 ${config.borderColor} ${config.bgColor}`}
      onClick={checkServerStatus}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Server ${config.text} - Phản hồi: ${responseTime}ms - Click để làm mới`}
    >
      {/* Status Dot với pulse effect */}
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
        {status === 'online' && (
          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-30"></div>
        )}
      </div>
      
      {/* Status Icon */}
      <StatusIcon className={`h-3 w-3 ${config.textColor} transition-transform duration-200 ${isHovered ? 'scale-110' : ''}`} />
      
      {/* Status Text (responsive) */}
      <span className={`text-xs font-medium ${config.textColor} hidden sm:inline-block`}>
        {config.text}
      </span>
      
      {/* Response Time - chỉ hiện khi online */}
      {status === 'online' && (
        <span className="text-xs text-gray-500 font-mono hidden md:inline-block">
          {responseTime}ms
        </span>
      )}
      
      {/* Current Time - ẩn trên mobile */}
      <div className="items-center gap-1 text-xs text-gray-600 font-mono hidden lg:flex">
        <Clock className="h-3 w-3" />
        <span>{currentTime}</span>
      </div>
      
      {/* Refresh indicator khi hover */}
      {isHovered && (
        <div className="text-xs text-gray-400 hidden xl:block">
          ↻
        </div>
      )}
    </div>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { getItemCount } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsNavigating(false);
  }, [pathname]);

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const isActiveRoute = (route: string) => {
    return pathname === route || (route !== '/' && pathname.startsWith(route));
  };

  const navLinks = [
    { href: '/', label: 'Trang chủ', icon: Home },
    { href: '/products', label: 'Sản phẩm', icon: Package },
    { href: '/about', label: 'Giới thiệu', icon: Award },
    ...(isAuthenticated ? [{ href: '/orders', label: 'Đơn hàng', icon: ShoppingBag }] : [])
  ];

  return (
    <>
      {/* Navigation Loading Bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-[100] animate-pulse">
          <div className="h-full bg-gradient-to-r from-transparent to-white/30 animate-[shimmer_1s_infinite]"></div>
        </div>
      )}

      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20' 
          : 'bg-white/90 backdrop-blur-lg shadow-lg'
      }`}>
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center group">
              <Link 
                href="/" 
                className="flex items-center space-x-3 transform transition-all duration-300 hover:scale-105"
                onClick={() => handleNavigation('/')}
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-3 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <ShoppingBag className="h-7 w-7" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 animate-pulse transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    SportStore
                  </span>
                  <span className="text-xs text-gray-500 font-medium -mt-1">Premium Sports</span>
                </div>
              </Link>
            </div>

            {/* Center Section - Navigation + Search */}
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center space-x-8 max-w-4xl">
                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => handleNavigation(link.href)}
                      className={`group relative px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                        isActiveRoute(link.href)
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </div>
                      {isActiveRoute(link.href) && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                      )}
                    </Link>
                  ))}

                  {/* Admin Dropdown */}
                  {isAdmin && (
                    <div className="relative group">
                      <Link
                        href="/admin"
                        onClick={() => handleNavigation('/admin')}
                        className={`group flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                          isActiveRoute('/admin')
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600'
                        }`}
                      >
                        <Shield className="h-4 w-4" />
                        <span>Quản trị</span>
                        <Sparkles className="h-3 w-3 opacity-60" />
                      </Link>

                      {/* Admin Dropdown Menu */}
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="p-2">
                          {[
                            { href: '/admin', label: 'Dashboard', icon: Home },
                            { href: '/admin/products', label: 'Quản lý sản phẩm', icon: Package },
                            { href: '/admin/orders', label: 'Quản lý đơn hàng', icon: ShoppingBag },
                            { href: '/admin/users', label: 'Quản lý Users', icon: User }
                          ].map((item, index) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => handleNavigation(item.href)}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 rounded-xl transition-all duration-200 transform hover:scale-105"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </nav>

                {/* Search Bar - Moved closer to nav */}
                <div className="hidden md:flex max-w-md">
                  <div className="w-full relative group">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white/90 transition-all duration-300 text-sm font-medium placeholder-gray-500"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-5 w-5 transition-colors duration-200" />
                    
                    {/* Search suggestions */}
                    {searchQuery && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2 opacity-0 animate-fadeIn">
                        <div className="text-sm text-gray-500 p-3">
                          Tìm kiếm: "{searchQuery}"...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Server Status */}
              <ServerStatus />
              
              {/* Cart */}
              <Link 
                href="/cart" 
                onClick={() => handleNavigation('/cart')}
                className="relative group p-3 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50/50 rounded-xl transform hover:scale-105"
              >
                <ShoppingCart className="h-6 w-6" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {getItemCount()}
                  </span>
                )}
                <div className="absolute -inset-2 bg-blue-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300 p-3 hover:bg-blue-50/50 rounded-xl transform hover:scale-105 group"
                  >
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-2 rounded-xl">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    </div>
                    <div className="hidden lg:block whitespace-nowrap">
                      <span className="text-sm font-semibold whitespace-nowrap">{user?.fullName}</span>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        {isAdmin ? 'Quản trị viên' : 'Thành viên'}
                      </div>
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 opacity-100 animate-fadeIn">
                        <div className="p-2">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <div className="font-semibold text-gray-900">{user?.fullName}</div>
                            <div className="text-sm text-gray-500">{user?.email}</div>
                          </div>
                          
                          {[
                            { href: '/profile', label: 'Hồ sơ cá nhân', icon: Settings },
                            { href: '/orders', label: 'Đơn hàng của tôi', icon: ShoppingBag },
                            ...(isAdmin ? [{ href: '/admin', label: 'Trang quản trị', icon: Shield }] : [])
                          ].map((item, index) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => {
                                setIsUserMenuOpen(false);
                                handleNavigation(item.href);
                              }}
                              className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 rounded-xl transition-all duration-200 transform hover:scale-105"
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <item.icon className="h-4 w-4" />
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                          
                          <hr className="my-2 border-gray-100" />
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    href="/auth/login"
                    onClick={() => handleNavigation('/auth/login')}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/auth/register"
                    onClick={() => handleNavigation('/auth/register')}
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-xl border-t border-gray-100/50">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>

              {/* Mobile Navigation Links */}
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleNavigation(link.href);
                  }}
                  className={`flex items-center space-x-3 px-4 py-4 text-base font-semibold rounded-xl transition-all duration-300 ${
                    isActiveRoute(link.href)
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleNavigation('/auth/login');
                    }}
                    className="block w-full text-center px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleNavigation('/auth/register');
                    }}
                    className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl transition-all duration-300"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        /* Prevent text wrapping in header */
        header * {
          white-space: nowrap !important;
        }
        
        /* Allow wrapping for specific elements that need it */
        header .allow-wrap,
        header input,
        header textarea {
          white-space: normal !important;
        }
      `}</style>
    </>
  );
} 