'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  Star, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Heart,
  Eye,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ShoppingBag,
  Tag,
  Award,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Product Skeleton Component
const ProductSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  </div>
);

// Enhanced Product Card Component
const ProductCard = ({ product, viewMode, onAddToCart }: { 
  product: Product, 
  viewMode: 'grid' | 'list',
  onAddToCart: (product: Product) => void 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { text: 'Hết hàng', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (quantity <= 5) return { text: `Chỉ còn ${quantity}`, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' };
    return { text: `Còn ${quantity}`, color: 'text-green-600', bg: 'bg-green-50 border-green-200' };
  };

  const stockStatus = getStockStatus(product.quantity || 0);

  if (viewMode === 'list') {
    return (
      <div 
        className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 transform hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-6 p-6">
          <div className="relative w-32 h-32 flex-shrink-0">
            <Link href={`/products/${product.id}`}>
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
                <Image
                  src={product.imageUrl || '/placeholder-product.jpg'}
                  alt={product.name || 'Sản phẩm'}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>
            </Link>
            
            {/* Quick Actions */}
            <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-8 h-8 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 ${
                  isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
                }`}
              >
                <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <Link 
                href={`/products/${product.id}`}
                className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              >
                <Eye className="h-4 w-4" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {product.category && (
                <span className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full mb-3 font-semibold">
                  <Tag className="h-3 w-3" />
                  {product.category}
                </span>
              )}
              
              <Link href={`/products/${product.id}`}>
                <h3 className="font-bold text-xl text-gray-900 mb-3 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300">
                  {product.name || 'Tên sản phẩm'}
                </h3>
              </Link>
              
              {product.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                </div>
                
                <span className={`text-sm px-3 py-1 rounded-full border ${stockStatus.bg} ${stockStatus.color} font-semibold`}>
                  {stockStatus.text}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                {formatPrice(product.price || 0)}
              </div>
              
              <button
                onClick={() => onAddToCart(product)}
                disabled={(product.quantity || 0) <= 0}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
            <Image
              src={product.imageUrl || '/placeholder-product.jpg'}
              alt={product.name || 'Sản phẩm'}
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onLoad={() => setImageLoading(false)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-product.jpg';
              }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </Link>

        {/* Product Badge */}
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 text-xs bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full font-semibold shadow-lg">
              <Tag className="h-3 w-3" />
              {product.category}
            </span>
          </div>
        )}

        {/* Quick Actions */}
        <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`w-10 h-10 rounded-full backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300 ${
              isLiked ? 'bg-red-500 text-white shadow-lg scale-110' : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart className="h-5 w-5" fill={isLiked ? 'currentColor' : 'none'} />
          </button>
          <Link 
            href={`/products/${product.id}`}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>

        {/* Stock Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`text-xs px-3 py-1 rounded-full border ${stockStatus.bg} ${stockStatus.color} font-semibold backdrop-blur-sm`}>
            {stockStatus.text}
          </span>
        </div>
      </div>

      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 line-clamp-2">
            {product.name || 'Tên sản phẩm'}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-black text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            {formatPrice(product.price || 0)}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={(product.quantity || 0) <= 0}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          {(product.quantity || 0) <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await api.getProducts();
      
      if (Array.isArray(data)) {
        setProducts(data);
        
        // Set price range based on products
        if (data.length > 0) {
          const prices = data.map(p => p.price || 0);
          setPriceRange([Math.min(...prices), Math.max(...prices)]);
        }
      } else {
        setError('Dữ liệu sản phẩm không đúng định dạng');
      }
    } catch (err: any) {
      console.error('❌ Lỗi tải sản phẩm:', err);
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    try {
      if (product.quantity <= 0) {
        toast.error('Sản phẩm đã hết hàng', {
          icon: '❌',
          duration: 2000,
          style: { borderRadius: '12px', background: '#ef4444', color: '#fff' }
        });
        return;
      }
      
      addToCart(product, 1);
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng`, {
        icon: '🛒',
        duration: 1500,
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' }
      });
    } catch (err) {
      toast.error('Có lỗi khi thêm vào giỏ hàng');
    }
  };

  // Get unique categories
  const categories = ['ALL', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  // Filter and sort products
  const getFilteredProducts = () => {
    let filtered = products;
    
    // Category filter
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const name = product.name || '';
        const description = product.description || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               description.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
    
    // Price range filter
    filtered = filtered.filter(product => {
      const price = product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'popularity':
          return (b.quantity || 0) - (a.quantity || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });
    
    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Loading state with enhanced skeleton
  if (loading) {
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang tải sản phẩm...</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 mt-12">
              {[...Array(8)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-white/10 rounded-3xl mx-auto flex items-center justify-center mb-8 backdrop-blur-sm">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Có lỗi xảy ra</h2>
          <p className="text-white/80 mb-8">{error}</p>
          <button
            onClick={loadProducts}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl inline-flex items-center gap-3"
          >
            Thử lại
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 border border-white rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-white">
          <Link 
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Quay về trang chủ
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black mb-6">
              Khám phá sản phẩm
              <span className="block text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text">
                Thể thao đỉnh cao
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Trang bị những sản phẩm thể thao chất lượng cao từ các thương hiệu hàng đầu thế giới
            </p>
            
            {/* Hero Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { label: 'Sản phẩm', value: products.length, icon: ShoppingBag },
                { label: 'Danh mục', value: categories.length - 1, icon: Tag },
                { label: 'Thương hiệu', value: '50+', icon: Award },
                { label: 'Đánh giá', value: '4.8★', icon: Star }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                  <stat.icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Enhanced Filters */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg"
                />
              </div>

              {/* View Mode & Filter Toggle */}
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'grid' 
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                      : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                >
                  <Filter className="h-5 w-5" />
                  Bộ lọc
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Danh mục</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'ALL' ? 'Tất cả danh mục' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sắp xếp</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="name">Tên A-Z</option>
                    <option value="price-low">Giá thấp → cao</option>
                    <option value="price-high">Giá cao → thấp</option>
                    <option value="popularity">Phổ biến nhất</option>
                  </select>
                </div>
                
                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Khoảng giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="range"
                      min={0}
                      max={10000000}
                      step={100000}
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min={0}
                      max={10000000}
                      step={100000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Filter Summary */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold text-blue-600">{filteredProducts.length}</span> sản phẩm
                {searchTerm && <span> cho "<span className="font-semibold">{searchTerm}</span>"</span>}
              </div>
              
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('ALL');
                  setSortBy('name');
                  setPriceRange([0, 10000000]);
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-8">
                <Search className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h3>
              <p className="text-gray-600 mb-8 text-lg">
                {searchTerm || categoryFilter !== 'ALL' 
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm sản phẩm'
                  : 'Chưa có sản phẩm nào trong danh mục này'
                }
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('ALL');
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3"
              >
                <Sparkles className="h-5 w-5" />
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
                : 'space-y-6'
            }>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-fade-in-up"
                >
                  <ProductCard 
                    product={product} 
                    viewMode={viewMode} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {filteredProducts.length > 0 && filteredProducts.length % 12 === 0 && (
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-3">
                <TrendingUp className="h-5 w-5" />
                Tải thêm sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
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
          animation: fade-in-up 0.6s ease-out forwards;
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