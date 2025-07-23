'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold">SportStore</span>
            </div>
            <p className="text-secondary-300 text-sm">
              Cửa hàng đồ thể thao hàng đầu Việt Nam với các sản phẩm chất lượng cao, 
              phục vụ mọi nhu cầu tập luyện và thể thao của bạn.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-secondary-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Trang chủ
              </Link>
              <Link 
                href="/products" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Sản phẩm
              </Link>
              <Link 
                href="/about" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Về chúng tôi
              </Link>
              <Link 
                href="/contact" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Liên hệ
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
            <div className="space-y-2">
              <Link 
                href="/help" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Trung tâm hỗ trợ
              </Link>
              <Link 
                href="/shipping" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Chính sách giao hàng
              </Link>
              <Link 
                href="/returns" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Đổi trả hàng
              </Link>
              <Link 
                href="/privacy" 
                className="block text-secondary-300 hover:text-white transition-colors text-sm"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-secondary-300">
                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">
                  123 Đường Thể Thao, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-300">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">
                  <a href="tel:+84123456789" className="hover:text-white transition-colors">
                    +84 123 456 789
                  </a>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-secondary-300">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">
                  <a href="mailto:info@sportstore.vn" className="hover:text-white transition-colors">
                    info@sportstore.vn
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-secondary-400 text-sm">
            © 2024 SportStore. Tất cả quyền được bảo lưu.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/terms" 
              className="text-secondary-400 hover:text-white text-sm transition-colors"
            >
              Điều khoản sử dụng
            </Link>
            <Link 
              href="/privacy" 
              className="text-secondary-400 hover:text-white text-sm transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link 
              href="/cookies" 
              className="text-secondary-400 hover:text-white text-sm transition-colors"
            >
              Chính sách Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 