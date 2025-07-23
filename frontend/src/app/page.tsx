'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import api from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { 
  ShoppingCart, 
  Star, 
  Search, 
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Award,
  TrendingUp,
  Heart,
  Eye,
  Play,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Mock Products Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Nike Air Max 270',
    description: 'Giày thể thao Nike Air Max 270 với đệm khí tối đa, thiết kế hiện đại',
    price: 3200000,
    quantity: 15,
    category: 'Giày thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  },
  {
    id: 2,
    name: 'Adidas Ultraboost 22',
    description: 'Giày chạy bộ Adidas Ultraboost 22 với công nghệ Boost Energy Return',
    price: 4500000,
    quantity: 8,
    category: 'Giày chạy bộ',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
  },
  {
    id: 3,
    name: 'Áo thun Nike Dri-FIT',
    description: 'Áo thun thể thao Nike Dri-FIT công nghệ thấm hút mồ hôi',
    price: 890000,
    quantity: 25,
    category: 'Áo thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
  },
  {
    id: 4,
    name: 'Quần short Adidas',
    description: 'Quần short thể thao Adidas 3-Stripes thoáng mát, co giãn tốt',
    price: 650000,
    quantity: 12,
    category: 'Quần thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1506629905607-bb5c93e5b1e9?w=400&h=400&fit=crop'
  },
  {
    id: 5,
    name: 'Bóng đá FIFA Quality',
    description: 'Bóng đá FIFA Quality Pro chính thức, chất liệu da tổng hợp cao cấp',
    price: 1200000,
    quantity: 6,
    category: 'Dụng cụ thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'
  },
  {
    id: 6,
    name: 'Găng tay Boxing',
    description: 'Găng tay boxing chuyên nghiệp, chất liệu da thật, đệm bảo vệ tối ưu',
    price: 850000,
    quantity: 10,
    category: 'Dụng cụ tập luyện',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop'
  },
  {
    id: 7,
    name: 'Áo khoác Nike Windrunner',
    description: 'Áo khoác Nike Windrunner chống gió, nhẹ nhàng và thời trang',
    price: 2100000,
    quantity: 7,
    category: 'Áo khoác thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop'
  },
  {
    id: 8,
    name: 'Bình nước Hydro Flask',
    description: 'Bình nước thể thao Hydro Flask 500ml, giữ nhiệt 12h, BPA-free',
    price: 750000,
    quantity: 20,
    category: 'Phụ kiện thể thao',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
  }
];

// Enhanced Loading Progress Component with Bright Theme
const LoadingProgress = ({ progress, message }: { progress: number; message: string }) => (
  <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center z-50">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      {/* Floating Bright Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full animate-pulse shadow-lg"></div>
      <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-200/30 rounded-full animate-bounce shadow-lg"></div>
      <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-200/30 rounded-full animate-ping shadow-lg"></div>
      <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-200/30 rounded-full animate-pulse shadow-lg"></div>
      
      {/* Additional decorative elements */}
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-green-200/20 rounded-full animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-yellow-200/20 rounded-full animate-bounce delay-300"></div>
    </div>
    
    <div className="relative text-center">
      {/* Enhanced Animated Logo */}
      <div className="relative mb-8">
        {/* Simple elegant logo design */}
        <div className="relative">
          {/* Subtle glow effect */}
          <div className="absolute -inset-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
          
          {/* Main Logo Container */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl">
            {/* Subtle inner highlight */}
            <div className="absolute inset-1 bg-gradient-to-br from-white/10 to-transparent rounded-xl"></div>
            
            {/* Dynamic Icon based on loading stage */}
            <div className="relative z-10">
              {message.includes('video') ? (
                <Play className="h-14 w-14 text-white" />
              ) : message.includes('sản phẩm') ? (
                <ShoppingCart className="h-14 w-14 text-white" />
              ) : message.includes('server') ? (
                <Zap className="h-14 w-14 text-white" />
              ) : (
                <Award className="h-14 w-14 text-white" />
              )}
            </div>
          </div>
        </div>
        
        {/* Improved Typography */}
        <div className="mt-6">
          <h1 className="text-5xl font-black mb-2 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Sport
            </span>
            <span className="bg-gradient-to-r from-blue-700 to-purple-600 bg-clip-text text-transparent">
              Store
            </span>
          </h1>
          
          {/* Simple progress underline */}
          <div className="w-48 mx-auto h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Loading Message */}
      <p className="text-xl text-gray-600 mb-8 font-medium">{message}</p>
      
      {/* Progress Percentage */}
      <div className="mb-8">
        <p className="text-2xl font-bold text-gray-800 mb-4">{progress}% hoàn thành</p>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Loading tips */}
      <div className="mt-12 max-w-md mx-auto">
        <p className="text-gray-600 text-sm leading-relaxed">
          {progress < 30 && "Đang kết nối đến server và tải dữ liệu..."}
          {progress >= 30 && progress < 60 && "Đang chuẩn bị video background chất lượng cao..."}  
          {progress >= 60 && progress < 90 && "Tối ưu hóa trải nghiệm cho thiết bị của bạn..."}
          {progress >= 90 && "Sắp hoàn tất! Chỉ còn vài giây nữa..."}
        </p>
      </div>
      
      {/* Additional visual elements */}
      <div className="absolute -z-10 inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  </div>
);

// Product Card Component
const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div 
      className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden transform hover:-translate-y-3 hover:scale-105"
      style={{ 
        animationDelay: `${index * 150}ms`,
        animation: 'fadeInUp 0.8s ease-out forwards'
      }}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative">
            <Image
              src={product.imageUrl || 'https://via.placeholder.com/400x400'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            {/* View Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <Eye className="h-6 w-6 text-gray-900" />
              </div>
            </div>
          </div>
        </Link>
        
        {/* Stock Badge */}
        {product.quantity <= 5 && product.quantity > 0 && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse">
            Chỉ còn {product.quantity}
          </div>
        )}
        
        {/* Favorite Button */}
        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <Heart className="h-5 w-5 text-gray-700 hover:text-red-500 transition-colors" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-3">
          <span className="text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            {product.category}
          </span>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2 text-lg group-hover:text-blue-600">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="text-sm text-gray-500 font-medium">(4.8)</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
              {formatPrice(product.price)}
            </div>
            <div className={`text-sm mt-1 font-medium ${
              product.quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.quantity > 0 ? (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Còn hàng
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Hết hàng
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-xl group-hover:shadow-2xl"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
        
        {/* Trending Badge */}
        <div className="flex items-center text-emerald-600 text-sm font-semibold">
          <TrendingUp className="h-4 w-4 mr-1" />
          Trending
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    initializePage();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (searchTerm.trim() && searchTerm.length >= 2) {
        setIsSearching(true);
        try {
          const suggestions = await fetchSearchSuggestions(searchTerm);
          setSearchSuggestions(suggestions);
        } catch (error) {
          console.error('Search error:', error);
          setSearchSuggestions(filteredSearchResults);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchSuggestions([]);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, products]);

  const initializePage = async () => {
    try {
      // Enhanced loading stages with video preparation
      const stages = [
        { progress: 5, message: 'Khởi tạo ứng dụng...', delay: 400 },
        { progress: 15, message: 'Kết nối server...', delay: 600 },
        { progress: 25, message: 'Chuẩn bị video background...', delay: 500 },
        { progress: 40, message: 'Đang tải sản phẩm...', delay: 600 },
        { progress: 55, message: 'Xử lý dữ liệu...', delay: 500 },
        { progress: 70, message: 'Tối ưu hóa giao diện...', delay: 400 },
        { progress: 85, message: 'Đang hoàn thiện...', delay: 600 },
        { progress: 95, message: 'Sẵn sàng!', delay: 500 }
      ];

      for (const stage of stages) {
        setLoadingProgress(stage.progress);
        setLoadingMessage(stage.message);
        await new Promise(resolve => setTimeout(resolve, stage.delay));
      }

      // Load data
      try {
        const apiData = await api.getProducts();
        if (Array.isArray(apiData) && apiData.length > 0) {
          setProducts(apiData);
          console.log(`✅ Loaded ${apiData.length} products from API`);
        } else if (apiData?.data && Array.isArray(apiData.data)) {
          setProducts(apiData.data);
          console.log(`✅ Loaded ${apiData.data.length} products from API`);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.log('⚠️ API unavailable, using mock data');
        setProducts(MOCK_PRODUCTS);
      }
      
      setDataLoaded(true);

      // Final loading phase - wait for video
      setLoadingProgress(100);
      setLoadingMessage('Đang hoàn thiện video...');
      
      // Wait for video to be ready or timeout after 3 seconds
      const videoTimeout = setTimeout(() => {
        console.log('⚠️ Video loading timeout, proceeding without video');
        setVideoLoaded(true);
      }, 3000);

      // Check if video is already loaded
      if (videoLoaded) {
        clearTimeout(videoTimeout);
      }

    } catch (error) {
      console.error('❌ Initialization error:', error);
      setProducts(MOCK_PRODUCTS);
      setDataLoaded(true);
      setVideoLoaded(true);
    }
  };

  // Only hide loading when both data and video are ready
  useEffect(() => {
    if (dataLoaded && videoLoaded) {
      setTimeout(() => {
        setLoading(false);
        console.log('🎉 Page fully loaded with video ready');
      }, 500);
    }
  }, [dataLoaded, videoLoaded]);

  const handleVideoCanPlay = () => {
    console.log('✅ Video ready to play');
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.log('❌ Video failed to load, using gradient background');
    setVideoLoaded(true); // Continue without video
  };

  const handleVideoLoadStart = () => {
    console.log('📹 Video loading started...');
  };

  const handleVideoLoadedData = () => {
    console.log('📹 Video data loaded successfully');
  };

  // Enhanced search function with null checks và database support
  const filteredSearchResults = products.filter(product => {
    if (!searchTerm.trim()) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const name = (product.name || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const category = (product.category || '').toLowerCase();
    
    return name.includes(searchLower) || 
           description.includes(searchLower) || 
           category.includes(searchLower);
  }).slice(0, 8); // Tăng số lượng đề xuất

  // Function để fetch search suggestions từ API
  const fetchSearchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) return [];
    
    try {
      // Sử dụng API search với query parameters
      const response = await api.getProducts({ 
        search: query,
        limit: 10 
      });
      
      if (Array.isArray(response)) {
        return response;
      } else if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.log('Search API error, using local filter');
      return filteredSearchResults;
    }
  };

  // Function để highlight search term trong text
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-semibold rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  // Enhanced search input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(true);
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
  };

  const handleSearchBlur = () => {
    // Delay hiding results to allow clicking on them
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Loading Screen
  if (loading) {
    return <LoadingProgress progress={loadingProgress} message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          {/* Fallback Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
          
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
            onLoadStart={handleVideoLoadStart}
            onLoadedData={handleVideoLoadedData}
            style={{ 
              width: '100%', 
              height: '100%',
              objectFit: 'cover',
              transform: 'scale(1.15)'
            }}
          >
            <source src="/videos/sports-background.mp4" type="video/mp4" />
            <source src="/videos/background.mp4" type="video/mp4" />
            <source src="/videos/sports.mp4" type="video/mp4" />
            <source src="/videos/sports-background.webm" type="video/webm" />
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
          
          {/* Animated overlay elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400/10 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-400/10 rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-400/10 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              SportStore
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-semibold text-white/90">
              🏆 Cửa hàng thể thao hàng đầu Việt Nam
            </p>
            <p className="text-lg md:text-xl mb-12 text-white/70 max-w-3xl mx-auto leading-relaxed">
              Khám phá bộ sưu tập đồ thể thao chất lượng cao từ những thương hiệu uy tín nhất thế giới. 
              Từ giày chạy bộ professional đến dụng cụ tập gym chuyên nghiệp.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link 
                href="/products"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-2xl flex items-center gap-3 hover:shadow-cyan-500/25"
              >
                <ShoppingCart className="h-6 w-6" />
                Khám phá ngay
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button 
                onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105 backdrop-blur-sm flex items-center gap-3"
              >
                <Play className="h-5 w-5" />
                Xem sản phẩm
              </button>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm thể thao..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white/95 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-500 shadow-2xl text-lg font-medium"
                />
                
                {/* Live Search Results */}
                {searchTerm && showSearchResults && (isSearching ? (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto z-50">
                    <div className="p-4 text-gray-600 text-center flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                      Đang tìm kiếm...
                    </div>
                  </div>
                ) : searchSuggestions.length > 0 ? (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto z-50">
                    <div className="p-2">
                      <div className="text-xs text-gray-500 px-4 py-2 border-b border-gray-100">
                        Tìm thấy {searchSuggestions.length} kết quả
                      </div>
                      {searchSuggestions.map((product) => (
                        <Link 
                          key={product.id}
                          href={`/products/${product.id}`}
                          className="flex items-center gap-4 p-4 hover:bg-blue-50/80 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          <Image
                            src={product.imageUrl || 'https://via.placeholder.com/50x50'}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="rounded-xl object-cover"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-gray-900 text-sm">
                              {highlightSearchTerm(product.name, searchTerm)}
                            </p>
                            {product.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {highlightSearchTerm(product.description.substring(0, 60) + '...', searchTerm)}
                              </p>
                            )}
                            <p className="text-sm text-blue-600 font-medium mt-1">{formatPrice(product.price)}</p>
                          </div>
                          {product.category && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              {product.category}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <Link 
                        href={`/products?search=${encodeURIComponent(searchTerm)}`}
                        className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 text-sm"
                      >
                        Xem tất cả kết quả cho "{searchTerm}"
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : searchTerm.trim() && searchTerm.length >= 2 ? (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-h-96 overflow-y-auto z-50">
                    <p className="p-4 text-gray-600 text-center">
                      Không tìm thấy kết quả cho "{searchTerm}". 
                      <Link href="/products" className="text-blue-600 ml-1 hover:underline">
                        Xem tất cả sản phẩm
                      </Link>
                    </p>
                  </div>
                ) : null)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Tại sao chọn <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">SportStore</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm thể thao tuyệt vời nhất với dịch vụ chất lượng cao
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: 'Giao hàng siêu tốc',
                desc: 'Giao hàng trong 2h tại nội thành, 24h toàn quốc',
                color: 'from-green-500 to-emerald-600',
                bgColor: 'from-green-50 to-emerald-50'
              },
              {
                icon: Shield,
                title: 'Hàng chính hãng',
                desc: '100% sản phẩm chính hãng, bảo hành chính thức',
                color: 'from-blue-500 to-cyan-600',
                bgColor: 'from-blue-50 to-cyan-50'
              },
              {
                icon: Award,
                title: 'Chất lượng A+',
                desc: 'Được tin tưởng bởi hơn 500k+ khách hàng',
                color: 'from-purple-500 to-pink-600',
                bgColor: 'from-purple-50 to-pink-50'
              },
              {
                icon: Zap,
                title: 'Hỗ trợ 24/7',
                desc: 'Đội ngũ tư vấn chuyên nghiệp luôn sẵn sàng',
                color: 'from-orange-500 to-red-600',
                bgColor: 'from-orange-50 to-red-50'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 bg-gradient-to-br bg-white border border-gray-100"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Sản phẩm <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">nổi bật</span> 🔥
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Khám phá {products.length} sản phẩm thể thao được yêu thích nhất
            </p>
            
            <div className="flex justify-center gap-4">
              <Link 
                href="/products"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-500 flex items-center gap-3 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 font-semibold"
              >
                Xem tất cả sản phẩm 
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 text-white">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Đăng ký nhận ưu đãi <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">đặc biệt</span> 🎁
          </h2>
          <p className="text-xl mb-12 text-white/80 leading-relaxed">
            Nhận thông báo sản phẩm mới và ưu đãi độc quyền dành riêng cho thành viên VIP
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-6 py-4 rounded-2xl bg-white/90 backdrop-blur-sm border-0 focus:ring-4 focus:ring-white/30 text-gray-900 placeholder-gray-500 font-medium"
            />
            <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-500 shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105">
              Đăng ký ngay
            </button>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
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