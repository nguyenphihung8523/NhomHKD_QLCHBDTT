# SaleM-2025 Backend - RESTful API  Swagger UI Documentation
---

## 📋 Tổng quan

SaleM-2025 là một ứng dụng Spring Boot backend với hệ thống quản lý bán hàng hoàn chỉnh, được tối ưu hóa cho Java 17:

### ✨ **Tính năng chính:**
- ✅ **JWT Authentication** với JJWT 0.12.3 (tương thích Java 17)
- ✅ **Role-based Authorization** (USER/ADMIN)
- ✅ **RESTful API** với Swagger UI Documentation
- ✅ **MySQL Database** với JPA/Hibernate
- ✅ **Docker Deployment** với docker-compose
- ✅ **Complete Order Management System**
- ✅ **User Profile Management** với validation
- ✅ **Admin Dashboard & Management**
- ✅ **Auto Database Migration** và seeding
- ✅ **Health Monitoring** với Spring Actuator

### 🔧 **Công nghệ sử dụng:**
- **Backend:** Spring Boot 3.2.0, Java 17
- **Security:** Spring Security 6.2.0, JJWT 0.12.3
- **Database:** MySQL 8.0, JPA/Hibernate
- **Documentation:** Swagger/OpenAPI 3
- **Containerization:** Docker, Docker Compose
- **Build Tool:** Maven 3.6+

## 🏗️ Kiến trúc hệ thống

### Cấu trúc phân quyền theo Controller:

#### 🔓 **Public Controllers** (Không cần đăng nhập)
- **AuthController** (`/api/v1/auth`) - Authentication
- **ProductViewController** (`/api/v1/products/view`) - Xem sản phẩm public

#### 🟡 **User Controllers** (User + Admin)
- **UserController** (`/api/v1/user`) - Profile management
- **OrdersController** (`/api/v1/orders`) - Order management cho user

#### 🔴 **Admin Controllers** (CHỈ ADMIN)
- **AdminController** (`/api/v1/admin`) - System management
- **ProductController** (`/api/v1/products`) - Product CRUD

## 🚀 Cách chạy dự án

### ⚡ Chạy nhanh với 1 lệnh duy nhất:

```bash
docker-compose up --build
```

**Chỉ cần 1 lệnh này sẽ:**
- ✅ Build Spring Boot application
- ✅ Khởi động MySQL database
- ✅ Chạy backend API server
- ✅ Tự động tạo database và tables
- ✅ Import dữ liệu mặc định

### 📋 Sau khi chạy:

**Truy cập ứng dụng:**
- **🌐 API Base URL:** http://localhost:8082/api
- **📚 Swagger UI:** http://localhost:8082/api/swagger-ui/index.html
- **❤️ Health Check:** http://localhost:8082/api/actuator/health

**Tài khoản admin mặc định:**
```
Username: admin
Password: hoangadmin
```

### 🔧 Lệnh hữu ích:

```bash
# Dừng ứng dụng
docker-compose down

# Xem logs
docker-compose logs -f app

# Xem logs MySQL
docker-compose logs -f mysql

# Rebuild từ đầu (khi có thay đổi code)
docker-compose down
docker-compose up --build

# Chạy ngầm (background)
docker-compose up -d --build

# Xóa tất cả containers và volumes (reset hoàn toàn)
docker-compose down -v
docker system prune -f
```

## 🔐 Hệ thống Authentication

### Tài khoản mặc định:
```
Username: admin
Password: hoangadmin
Role: ADMIN
```

### Quy trình đăng nhập:
1. **Đăng ký tài khoản:**
   ```bash
   POST /api/v1/auth/register
   Content-Type: application/x-www-form-urlencoded
   
   username=newuser&password=password123&fullName=Nguyen Van A
   ```

2. **Đăng nhập:**
   ```bash
   POST /api/v1/auth/login
   Content-Type: application/x-www-form-urlencoded
   
   username=admin&password=admin
   ```

3. **Response nhận JWT token (đăng ký):**
   ```json
   {
     "status": "success",
     "message": "Account created successfully",
     "username": "newuser",
     "fullName": "Nguyen Van A",
     "role": "USER"
   }
   ```

4. **Response nhận JWT token (đăng nhập):**
4. **Response nhận JWT token (đăng nhập):**
   ```json
   {
     "status": "success",
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzI1NiJ9...",
     "username": "admin",
     "role": "ADMIN"
   }
   ```

5. **Sử dụng token trong request:**
   ```bash
   Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
   ```

## 📚 API Endpoints Classification

### 🔓 PUBLIC ENDPOINTS (Không cần đăng nhập)
```
POST   /api/v1/auth/register           - Đăng ký tài khoản (cần username, password, fullName)
POST   /api/v1/auth/login              - Đăng nhập
GET    /api/v1/products/view           - Xem danh sách sản phẩm
GET    /api/v1/products/view/{id}      - Xem chi tiết sản phẩm
GET    /actuator/health                - Health check
```

### 🟡 USER/ADMIN ENDPOINTS (Cần đăng nhập)
```
GET    /api/v1/user/dashboard          - Dashboard user
GET    /api/v1/user/profile            - Xem profile cá nhân
PUT    /api/v1/user/profile            - Cập nhật profile
GET    /api/v1/user/profile/status     - Kiểm tra profile đầy đủ
GET    /api/v1/orders/my               - Xem đơn hàng của tôi
GET    /api/v1/orders/{id}             - Xem chi tiết đơn hàng
POST   /api/v1/orders                  - Tạo đơn hàng mới
PATCH  /api/v1/orders/{id}/cancel      - Hủy đơn hàng (chỉ PENDING)
```

### 🔴 ADMIN-ONLY ENDPOINTS
```
# Product Management
POST   /api/v1/products                - Tạo sản phẩm mới
PUT    /api/v1/products/{id}           - Cập nhật sản phẩm
DELETE /api/v1/products/{id}           - Xóa sản phẩm

# User Management
GET    /api/v1/admin/users             - Xem tất cả user
PUT    /api/v1/admin/users/{id}/role   - Thay đổi role user
DELETE /api/v1/admin/users/{id}        - Xóa user
GET    /api/v1/admin/dashboard         - Dashboard admin

# Order Management (Admin)
GET    /api/v1/admin/orders            - Xem tất cả đơn hàng
GET    /api/v1/admin/orders/{id}       - Xem chi tiết đơn hàng
PATCH  /api/v1/admin/orders/{id}/status - Cập nhật trạng thái đơn hàng
DELETE /api/v1/admin/orders/{id}       - Xóa đơn hàng
```

## 🛒 Order Management System

### Quy trình đặt hàng:

#### Bước 1: Cập nhật profile (bắt buộc)
```bash
# Kiểm tra profile đã đầy đủ chưa
GET /api/v1/user/profile/status
Authorization: Bearer {token}

# Cập nhật profile (địa chỉ và SĐT bắt buộc)
PUT /api/v1/user/profile
Authorization: Bearer {token}
Content-Type: application/x-www-form-urlencoded

fullName=Nguyen Van A&email=email@example.com&phone=0123456789&address=123 Main St
```

#### Bước 2: Tạo đơn hàng
```bash
POST /api/v1/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "notes": "Giao hàng buổi sáng",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
```

#### Bước 3: Quản lý đơn hàng
```bash
# Xem đơn hàng của tôi
GET /api/v1/orders/my
Authorization: Bearer {token}

# Xem theo trạng thái
GET /api/v1/orders/my?status=PENDING
Authorization: Bearer {token}

# Hủy đơn hàng (chỉ PENDING)
PATCH /api/v1/orders/{id}/cancel
Authorization: Bearer {token}
```

### Trạng thái đơn hàng:
- **PENDING**: Chờ xác nhận (mặc định)
- **CONFIRMED**: Đã xác nhận
- **SHIPPING**: Đang giao hàng
- **DELIVERED**: Đã giao hàng
- **CANCELLED**: Đã hủy

### Admin quản lý đơn hàng:
```bash
# Xem tất cả đơn hàng
GET /api/v1/admin/orders
Authorization: Bearer {admin_token}

# Cập nhật trạng thái
PATCH /api/v1/admin/orders/{id}/status
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

## 🔧 Swagger UI Usage

### Cách sử dụng JWT trong Swagger:
1. Truy cập: http://localhost:8081/swagger-ui/index.html
2. Đăng nhập qua `/api/v1/auth/login` để lấy token
3. Click nút **"Authorize"** ở đầu trang
4. Nhập token theo format: `Bearer <your-token>`
5. Click "Authorize" để áp dụng
6. Test các API cần authentication

### Thông tin tác giả trong Swagger:
- **Backend Developer:** Trầm Tấn Khá
- **Contact & License:** Hiển thị trong Swagger UI footer
- **GitHub Link:** Trực tiếp từ Swagger interface

### Ký hiệu trong Swagger:
- 🔓 **Không có khóa** = Public API
- 🔒 **Có khóa** = Cần JWT token
- 🔴 **Admin Only** = Chỉ role ADMIN
- 🟡 **User/Admin** = Role USER hoặc ADMIN

## 🗄️ Database Schema

### Core Entities:
- **UserAccountEntity** - Thông tin user (username, password, role, profile)
- **ProductEntity** - Sản phẩm (name, description, price, quantity)
- **OrdersEntity** - Đơn hàng (status, orderDate, totalAmount, notes)
- **OrderDetailEntity** - Chi tiết đơn hàng (quantity, unitPrice)
- **CustomerEntity** - Thông tin khách hàng (từ user profile)

### Relationships:
- User 1:N Orders
- Order 1:N OrderDetails  
- Product 1:N OrderDetails
- User 1:1 Customer (auto-created from profile)

## 🐳 Docker Configuration

### docker-compose.yaml:
```yaml
services:
  backend:
    build: .
    ports:
      - "8081:8081"
    depends_on:
      - mysql
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      
  mysql:
    image: mysql:8.0
    ports:
      - "3307:3306"
    environment:
      MYSQL_DATABASE: salem2025
      MYSQL_ROOT_PASSWORD: rootpass
```

### Build commands:
```bash
# Build lại image
docker-compose build

# Chạy detached mode
docker-compose up -d

# Xem logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## 🔒 Security Features

### JWT Configuration:
- **Algorithm:** HS512
- **Secret:** Configurable via application.properties
- **Expiration:** 24 hours (configurable)
- **Claims:** username, role, issued date

### Role-based Access Control:
- **@PreAuthorize("hasRole('ADMIN')")** - Admin only
- **@PreAuthorize("hasAnyRole('USER', 'ADMIN')")** - User + Admin
- **No annotation** - Public access

### Security Configuration:
```java
// Public endpoints
.requestMatchers("/v1/auth/**", "/v1/products/view/**").permitAll()

// Admin only
.requestMatchers("/v1/admin/**", "/v1/products/**").hasRole("ADMIN")

// User + Admin  
.requestMatchers("/v1/user/**", "/v1/orders/**").hasAnyRole("USER", "ADMIN")
```

## 📊 Admin Dashboard

### Admin Statistics:
```bash
GET /api/v1/admin/dashboard
Authorization: Bearer {admin_token}
```

Response:
```json
{
  "status": "success",
  "stats": {
    "totalUsers": 10,
    "totalAdmins": 2,
    "totalProducts": 50,
    "totalOrders": 150,
    "totalRevenue": 1500000
  }
}
```

### User Management:
```bash
# Xem tất cả users
GET /api/v1/admin/users

# Thay đổi role
PUT /api/v1/admin/users/{id}/role?role=ADMIN

# Xóa user
DELETE /api/v1/admin/users/{id}
```

## 🧪 Testing

### Endpoint Testing với curl:
```bash
# Test public endpoint
curl -X GET http://localhost:8081/api/v1/products/view

# Test đăng ký tài khoản
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123&fullName=Nguyen Van Test"

# Test authentication
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=hoangadmin"

# Test authenticated endpoint
curl -X GET http://localhost:8081/api/v1/user/profile \
  -H "Authorization: Bearer <your-token>"
```

### Health Check:
```bash
curl http://localhost:8081/actuator/health
```

## 📝 Development Notes

### Key Features Implemented:
- ✅ Complete authentication & authorization system
- ✅ Role-based endpoint separation
- ✅ Order management with status tracking
- ✅ User profile with address/phone validation
- ✅ Admin dashboard with statistics
- ✅ Product catalog with inventory management
- ✅ Order cancellation by users
- ✅ Comprehensive Swagger documentation
- ✅ Docker containerization
- ✅ MySQL database integration
- ✅ JWT token security

### Architecture Decisions:
- **Controller separation** by role (Admin vs User endpoints)
- **DTO pattern** for clean API responses
- **Service layer** for business logic
- **Repository pattern** for data access
- **JWT stateless** authentication
- **Docker** for consistent deployment

## 🐛 Troubleshooting

### Common Issues:

1. **JWT Token Expired:**
   - Re-login to get new token
   - Check token expiration time

2. **403 Forbidden:**
   - Verify token is included in Authorization header
   - Check user role permissions

3. **Database Connection:**
   - Ensure MySQL is running (docker-compose up)
   - Check application-docker.properties config

4. **Port Conflicts:**
   - Backend chạy trên port 8082 (tránh conflict với IntelliJ)
   - MySQL chạy trên port 3307 (tránh conflict với MySQL local)
   - Có thể thay đổi ports trong docker-compose.yaml nếu cần

### 🐛 Debug Commands:
```bash
# Check container logs
docker-compose logs app
docker-compose logs mysql

# Check database connection  
docker-compose exec mysql mysql -u root -p salem2025

# Restart services
docker-compose restart app

# Check running containers
docker-compose ps

# Access container shell
docker-compose exec app bash
```

## 🚀 Phiên bản & Cập nhật

### Version 1.0.0 (Current)
- ✅ Spring Boot 3.2.0 + Java 17
- ✅ JJWT 0.12.3 (fixed JWT issues)
- ✅ Fixed port conflicts (8082/3307)
- ✅ Optimized Docker build
- ✅ Complete order management
- ✅ Admin panel functionality

### Planned Updates:
- 🔄 Frontend integration
- 🔄 Email notifications
- 🔄 Payment gateway integration
- 🔄 Real-time order tracking

## 📞 Support & Contact

<!-- ⚠️ PROTECTED AUTHOR CONTACT - DO NOT DELETE - THÔNG TIN LIÊN HỆ TÁC GIẢ ĐƯỢC BẢO VỆ ⚠️ -->

- **Backend Developer:** Trầm Tấn Khá  
- **GitHub:** [https://github.com/TanKha04](https://github.com/TanKha04)  
- **Phone:** 0889559357  
- **Email:** tramtankhatv@gmail.com  


<!-- 🔒 KHÔNG XÓA THÔNG TIN LIÊN HỆ TÁC GIẢ - PROTECTED CONTACT INFO 🔒 -->

Mọi câu hỏi về API, bugs, hoặc feature requests vui lòng tạo issue trên GitHub repository.

---

## 📄 License

<!-- ⚠️ PROTECTED LICENSE & COPYRIGHT - DO NOT DELETE ⚠️ -->

This project is developed by Trầm Tấn Khá for educational and portfolio purposes.

**© 2025 Trầm Tấn Khá - TanKha04**

<!-- 🔒 PROTECTED COPYRIGHT - KHÔNG XÓA THÔNG TIN BẢN QUYỀN 🔒 -->
