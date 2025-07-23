package com.example.salem2025.Api.v1;

import com.example.salem2025.service.UserAccountService;
import com.example.salem2025.service.OrdersService;
import com.example.salem2025.repository.entity.UserAccountEntity;
import com.example.salem2025.model.dto.UpdateOrderStatusDTO;
import com.example.salem2025.model.dto.OrdersDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Management", description = "API quản lý dành cho Admin (Cần role ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private OrdersService ordersService;

    @GetMapping("/users")
    @Operation(summary = "Lấy danh sách tất cả user", 
               description = "Chỉ Admin mới có thể xem danh sách tất cả user")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<UserAccountEntity> users = userAccountService.getAllUsers();
            response.put("status", "success");
            response.put("users", users);
            response.put("total", users.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get users: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/users/{userId}/role")
    @Operation(summary = "Cập nhật role của user", 
               description = "Admin có thể thay đổi role của user (ADMIN/USER)")
    public ResponseEntity<Map<String, String>> updateUserRole(
            @Parameter(description = "ID của user cần cập nhật", example = "2")
            @PathVariable Long userId,
            @Parameter(description = "Role mới", example = "ADMIN")
            @RequestParam String role) {
        
        Map<String, String> response = new HashMap<>();
        
        try {
            UserAccountEntity user = userAccountService.findById(userId);
            if (user == null) {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Validate role
            if (!"ADMIN".equals(role) && !"USER".equals(role)) {
                response.put("status", "error");
                response.put("message", "Invalid role. Must be ADMIN or USER");
                return ResponseEntity.badRequest().body(response);
            }
            
            user.setRole(role);
            userAccountService.save(user);
            
            response.put("status", "success");
            response.put("message", "User role updated successfully");
            response.put("username", user.getUsername());
            response.put("role", role);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update role: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Xóa user", 
               description = "Admin có thể xóa user (không được xóa admin)")
    public ResponseEntity<Map<String, String>> deleteUser(
            @Parameter(description = "ID của user cần xóa", example = "3")
            @PathVariable Long userId) {
        Map<String, String> response = new HashMap<>();
        
        try {
            UserAccountEntity user = userAccountService.findById(userId);
            if (user == null) {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Không cho phép xóa admin
            if ("ADMIN".equals(user.getRole())) {
                response.put("status", "error");
                response.put("message", "Cannot delete admin user");
                return ResponseEntity.badRequest().body(response);
            }
            
            userAccountService.deleteById(userId);
            
            response.put("status", "success");
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard admin", 
               description = "Xem thống kê tổng quan hệ thống (chỉ Admin)")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = userAccountService.getDashboardStats();
            response.put("status", "success");
            response.put("stats", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get dashboard: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // === ADMIN ORDER MANAGEMENT ===
    
    @GetMapping("/orders")
    @Operation(summary = "Xem tất cả đơn hàng", 
               description = "CHỈ ADMIN mới có thể xem tất cả đơn hàng trong hệ thống")
    public List<OrdersDTO> getAllOrders(
            @Parameter(description = "Lọc theo trạng thái (tùy chọn)", example = "PENDING")
            @RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return ordersService.getOrdersByStatus(status);
        }
        return ordersService.getAllOrders();
    }

    @GetMapping("/orders/{id}")
    @Operation(summary = "Xem chi tiết đơn hàng", 
               description = "Admin có thể xem chi tiết bất kỳ đơn hàng nào")
    public ResponseEntity<OrdersDTO> getOrderById(
            @Parameter(description = "ID của đơn hàng", example = "1")
            @PathVariable Long id) {
        
        OrdersDTO order = ordersService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(order);
    }

    @PatchMapping("/orders/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn hàng", 
               description = "CHỈ ADMIN mới có thể cập nhật trạng thái đơn hàng. Trạng thái: PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED")
    public ResponseEntity<?> updateOrderStatus(
            @Parameter(description = "ID của đơn hàng cần cập nhật trạng thái", example = "1")
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusDTO statusDTO) {
        try {
            OrdersDTO updatedOrder = ordersService.updateOrderStatus(id, statusDTO);
            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái thành công",
                "orderId", id,
                "newStatus", updatedOrder.getStatus(),
                "order", updatedOrder
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/orders/{id}")
    @Operation(summary = "Xóa đơn hàng", 
               description = "CHỈ ADMIN mới có thể xóa đơn hàng")
    public ResponseEntity<Map<String, String>> deleteOrder(
            @Parameter(description = "ID của đơn hàng cần xóa", example = "1")
            @PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            boolean deleted = ordersService.deleteOrder(id);
            if (!deleted) {
                response.put("status", "error");
                response.put("message", "Đơn hàng không tồn tại");
                return ResponseEntity.status(404).body(response);
            }
            response.put("status", "success");
            response.put("message", "Xóa đơn hàng thành công");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Lỗi khi xóa đơn hàng: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
