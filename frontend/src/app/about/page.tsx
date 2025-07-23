'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award,
  Target,
  Users,
  Globe,
  Heart,
  Zap,
  Shield,
  Truck,
  Star,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Play,
  Quote
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop"
              alt="Modern Sports Facility"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse backdrop-blur-sm border border-white/20"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-500/20 rounded-full animate-bounce backdrop-blur-sm border border-white/20"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-purple-500/20 rounded-full animate-ping backdrop-blur-sm border border-white/20"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-pink-500/20 rounded-full animate-pulse backdrop-blur-sm border border-white/20"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="animate-fadeInUp">
            <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Về SportStore
            </h1>
            <p className="text-2xl md:text-3xl mb-4 font-semibold text-white/90">
              🏆 Hành trình 15+ năm đam mê thể thao
            </p>
            <p className="text-lg md:text-xl mb-12 text-white/70 max-w-4xl mx-auto leading-relaxed">
              Từ một cửa hàng nhỏ đến thương hiệu thể thao hàng đầu Việt Nam, chúng tôi luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng đầu.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => document.getElementById('story-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-cyan-600 hover:to-blue-700 transition-all duration-500 transform hover:scale-105 shadow-2xl flex items-center gap-3 hover:shadow-cyan-500/25"
              >
                <Play className="h-6 w-6" />
                Câu chuyện của chúng tôi
              </button>
              
              <Link 
                href="/products"
                className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105 backdrop-blur-sm flex items-center gap-3"
              >
                Khám phá sản phẩm
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Năm kinh nghiệm', icon: Award },
              { number: '500K+', label: 'Khách hàng tin tưởng', icon: Users },
              { number: '10K+', label: 'Sản phẩm chất lượng', icon: Target },
              { number: '50+', label: 'Thương hiệu nổi tiếng', icon: Globe }
            ].map((stat, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story-section" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                Câu chuyện <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">thành công</span>
              </h2>
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  Năm 2008, với tình yêu bất tận dành cho thể thao và mong muốn mang đến những sản phẩm chất lượng cao cho cộng đồng yêu thể thao Việt Nam, SportStore ra đời từ một cửa hàng nhỏ tại TP.HCM.
                </p>
                <p>
                  Trải qua 15+ năm phát triển, chúng tôi đã không ngừng mở rộng và cải tiến, từ việc nhập khẩu trực tiếp từ các thương hiệu hàng đầu thế giới đến việc xây dựng hệ thống phân phối toàn quốc.
                </p>
                <p>
                  Hôm nay, SportStore tự hào là đối tác ủy quyền chính thức của hơn 50 thương hiệu thể thao nổi tiếng, phục vụ hơn 500,000 khách hàng trên toàn quốc với cam kết về chất lượng và dịch vụ tốt nhất.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { year: '2008', event: 'Thành lập SportStore' },
                  { year: '2012', event: 'Mở rộng toàn quốc' },
                  { year: '2018', event: 'Đối tác 20+ thương hiệu' },
                  { year: '2023', event: 'Nền tảng số hiện đại' }
                ].map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{milestone.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop"
                  alt="SportStore - Cửa hàng thể thao hiện đại"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-bold text-gray-900">4.8/5</span>
                </div>
                <div className="text-sm text-gray-600">Đánh giá khách hàng</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="font-bold text-gray-900">+25%</span>
                </div>
                <div className="text-sm text-gray-600">Tăng trường hàng năm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Sứ mệnh & <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">Tầm nhìn</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi tin rằng thể thao không chỉ là hoạt động giải trí mà còn là cách sống lành mạnh, tích cực
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 h-full shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Sứ mệnh</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Mang đến những sản phẩm thể thao chất lượng cao, chính hãng với giá cả hợp lý, giúp mọi người tiếp cận và yêu thích thể thao hơn. Chúng tôi cam kết xây dựng một cộng đồng thể thao mạnh mẽ và lành mạnh.
                </p>
                <div className="space-y-3">
                  {[
                    'Sản phẩm 100% chính hãng',
                    'Dịch vụ khách hàng tận tâm',
                    'Giá cả cạnh tranh nhất thị trường'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="relative group">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 h-full shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Tầm nhìn</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Trở thành thương hiệu thể thao số 1 Việt Nam, tiên phong trong việc ứng dụng công nghệ để mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng và đóng góp tích cực vào phong trào thể thao toàn dân.
                </p>
                <div className="space-y-3">
                  {[
                    'Dẫn đầu về chất lượng dịch vụ',
                    'Đổi mới công nghệ liên tục',
                    'Mở rộng ra thị trường quốc tế'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <span className="text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Giá trị <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">cốt lõi</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động của chúng tôi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Chất lượng',
                desc: 'Cam kết mang đến sản phẩm chất lượng cao nhất',
                color: 'from-blue-500 to-cyan-500',
                bgColor: 'from-blue-50 to-cyan-50'
              },
              {
                icon: Heart,
                title: 'Tận tâm',
                desc: 'Phục vụ khách hàng với sự tận tâm và nhiệt huyết',
                color: 'from-red-500 to-pink-500',
                bgColor: 'from-red-50 to-pink-50'
              },
              {
                icon: Zap,
                title: 'Đổi mới',
                desc: 'Không ngừng cải tiến và ứng dụng công nghệ mới',
                color: 'from-yellow-500 to-orange-500',
                bgColor: 'from-yellow-50 to-orange-50'
              },
              {
                icon: Users,
                title: 'Đồng hành',
                desc: 'Đồng hành cùng khách hàng trên hành trình thể thao',
                color: 'from-green-500 to-emerald-500',
                bgColor: 'from-green-50 to-emerald-50'
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Đội ngũ <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">chuyên nghiệp</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những con người tài năng và đầy đam mê đằng sau thành công của SportStore
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Nguyễn Văn Minh',
                role: 'CEO & Founder',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face',
                bio: '15+ năm kinh nghiệm trong ngành thể thao'
              },
              {
                name: 'Trần Thị Lan',
                role: 'Marketing Director',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
                bio: 'Chuyên gia marketing với nhiều chiến dịch thành công'
              },
              {
                name: 'Lê Hoàng Nam',
                role: 'Technical Director',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face',
                bio: 'Đầu tàu công nghệ, xây dựng nền tảng số hiện đại'
              }
            ].map((member, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-semibold mb-3">{member.role}</div>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop"
            alt="Sports Equipment Background"
            fill
            className="object-cover"
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Khách hàng <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">nói gì</span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Những chia sẻ chân thật từ cộng đồng khách hàng yêu mến SportStore
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Minh Tuấn',
                role: 'Runner',
                text: 'SportStore đã đồng hành cùng tôi trong suốt 5 năm chạy marathon. Sản phẩm chất lượng, dịch vụ tận tâm!',
                rating: 5
              },
              {
                name: 'Thu Hà',
                role: 'Yoga Instructor',
                text: 'Tôi rất hài lòng với bộ sưu tập đồ yoga tại đây. Chất liệu thoáng mát, thiết kế đẹp và giá cả hợp lý.',
                rating: 5
              },
              {
                name: 'Đức Anh',
                role: 'Gym Trainer',
                text: 'Là HLV gym, tôi thường giới thiệu SportStore cho học viên. Đa dạng sản phẩm và chất lượng đảm bảo.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white group hover:bg-white/20 transition-all duration-500"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Quote className="h-8 w-8 text-cyan-400 mb-4" />
                <p className="text-white/90 leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-cyan-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Sẵn sàng bắt đầu <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">hành trình</span>?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm thể thao chất lượng cao và bắt đầu hành trình khỏe mạnh của bạn ngay hôm nay
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/products"
              className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-600 transition-all duration-500 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              Mua sắm ngay
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="/contact"
              className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
            >
              Liên hệ với chúng tôi
            </Link>
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
      `}</style>
    </div>
  );
} 