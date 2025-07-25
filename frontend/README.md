
Trang web bán đồ thể thao được xây dựng bằng Next.js, TypeScript và Tailwind CSS.

## 🚀 Tính năng

### Dành cho khách hàng:
- **Trang chủ**: Hiển thị danh sách sản phẩm với tìm kiếm và lọc
- **Chi tiết sản phẩm**: Xem thông tin chi tiết, chọn số lượng, thêm vào giỏ
- **Giỏ hàng**: Quản lý sản phẩm, cập nhật số lượng, thanh toán
- **Đăng nhập/Đăng ký**: Xác thực người dùng
- **Hồ sơ cá nhân**: Cập nhật thông tin, địa chỉ giao hàng
- **Quản lý đơn hàng**: Xem lịch sử, trạng thái đơn hàng

### Dành cho Admin:
- **Dashboard**: Thống kê tổng quan hệ thống
- **Quản lý sản phẩm**: CRUD sản phẩm
- **Quản lý đơn hàng**: Xem, cập nhật trạng thái đơn hàng
- **Quản lý người dùng**: Xem danh sách, phân quyền

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React Icons
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context (Auth, Cart)
- **Notifications**: React Hot Toast
- **Image**: Next.js Image Component

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- npm >= 7.0.0
- Backend Spring Boot chạy trên port 8082

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Chạy development server:
```bash
npm run dev
```

### 3. Truy cập ứng dụng:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082/api

## 📁 Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Trang đăng nhập/đăng ký
│   ├── products/          # Trang sản phẩm
│   ├── cart/              # Trang giỏ hàng
│   ├── profile/           # Trang hồ sơ cá nhân
│   ├── admin/             # Trang quản trị
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Trang chủ
├── components/            # React components
│   └── layout/            # Layout components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Context xác thực
│   └── CartContext.tsx    # Context giỏ hàng
├── lib/                   # Utilities
│   └── api.ts            # API client
├── types/                # TypeScript definitions
│   └── index.ts          # Type definitions
└── styles/               # CSS files
    └── globals.css       # Global styles
```

## 🔧 Cấu hình API

Backend API endpoint được cấu hình trong:
- `src/lib/api.ts`: BASE_URL = http://localhost:8082/api
- `next.config.js`: Proxy rewrites cho development

## 👥 Tài khoản demo

### Admin:
- Username: `admin`
- Password: `hoangadmin`

### User:
- Tạo tài khoản mới thông qua trang đăng ký

## 🔐 Phân quyền

### Public (Không cần đăng nhập):
- Xem trang chủ
- Xem chi tiết sản phẩm
- Đăng ký/Đăng nhập

### USER (Cần đăng nhập):
- Tất cả tính năng public
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng (cần cập nhật địa chỉ, SĐT)
- Xem/quản lý đơn hàng cá nhân
- Cập nhật hồ sơ cá nhân

### ADMIN (Cần role admin):
- Tất cả tính năng user
- Truy cập trang quản trị
- Quản lý sản phẩm (CRUD)
- Quản lý tất cả đơn hàng
- Xem danh sách người dùng
- Thống kê dashboard

## 🔄 API Endpoints sử dụng

### Authentication:
- POST `/v1/auth/login` - Đăng nhập
- POST `/v1/auth/register` - Đăng ký

### Products (Public):
- GET `/v1/products/view` - Danh sách sản phẩm
- GET `/v1/products/view/{id}` - Chi tiết sản phẩm

### User Profile:
- GET `/v1/user/profile` - Thông tin profile
- PUT `/v1/user/profile` - Cập nhật profile
- GET `/v1/user/profile/status` - Trạng thái profile

### Orders:
- GET `/v1/orders/my` - Đơn hàng của tôi
- POST `/v1/orders` - Tạo đơn hàng mới
- GET `/v1/orders/{id}` - Chi tiết đơn hàng
- PATCH `/v1/orders/{id}/cancel` - Hủy đơn hàng

### Admin APIs:
- GET `/v1/admin/dashboard` - Dashboard stats
- GET `/v1/admin/users` - Danh sách users
- GET `/v1/admin/orders` - Tất cả đơn hàng
- PATCH `/v1/admin/orders/{id}/status` - Cập nhật trạng thái
- POST `/v1/products` - Tạo sản phẩm (Admin)
- PUT `/v1/products/{id}` - Sửa sản phẩm (Admin)
- DELETE `/v1/products/{id}` - Xóa sản phẩm (Admin)

## 🎨 UI/UX Features

- **Responsive Design**: Tối ưu cho mobile, tablet, desktop
- **Modern UI**: Sử dụng Tailwind CSS với theme chuyên nghiệp
- **Loading States**: Skeleton loading cho các API calls
- **Error Handling**: Toast notifications cho success/error
- **Form Validation**: Client-side validation với UX tốt
- **Image Optimization**: Next.js Image component
- **SEO Ready**: Metadata và structured data

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Hamburger menu cho mobile
- **Cards**: Responsive product cards
- **Tables**: Horizontal scroll trên mobile

## 🔍 SEO & Performance

- **Next.js App Router**: Server-side rendering
- **Image Optimization**: Lazy loading, WebP format
- **Code Splitting**: Automatic by Next.js
- **Font Optimization**: Google Fonts with display=swap
- **Meta Tags**: Dynamic meta tags cho từng trang

## 🚀 Deployment

### Vercel (Recommended):
```bash
npm run build
# Deploy to Vercel
```

### Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License.

## 📞 Liên hệ

- Website: [SportStore](http://localhost:3000)
