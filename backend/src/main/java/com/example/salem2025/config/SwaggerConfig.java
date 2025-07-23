package com.example.salem2025.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    // ...existing code...
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SaleM-2025 API")
                        .version("1.0.3")
                        .description("API cho hệ thống quản lý bán hàng với JWT Authentication & Role-based Access Control\n\n" +
                                "---\n\n" +
                                "**Hướng dẫn sử dụng:**\n" +
                                "1. Đăng ký tài khoản qua `/api/v1/auth/register` (cần username, password, fullName)\n" +
                                "2. Đăng nhập qua `/api/v1/auth/login` để lấy token\n" +
                                "3. Click vào nút 'Authorize' ở đầu trang\n" +
                                "4. Nhập token vào định dạng: `Bearer <your-token>`\n" +
                                "5. Click 'Authorize' để áp dụng\n\n" +
                                "**Phân quyền Endpoint:**\n" +
                                "- **Auth & General**: Không cần đăng nhập\n" +
                                "- **Product**: GET (tất cả) | POST/PUT/DELETE (ADMIN only)\n" +
                                "- **Order Management**: User chỉ xem/tạo đơn hàng của mình\n" +
                                "- **Admin Management**: CHỈ ADMIN - quản lý users, tất cả orders, dashboard\n\n" +
                                "**Tài khoản mặc định:**\n" +
                                "- Username: admin | Password: admin | Role: ADMIN\n" +
                                "- Đăng ký user mới qua `/api/v1/auth/register` (username, password, fullName)"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Nhập JWT token ở định dạng: Bearer <token>")));
    }
}
