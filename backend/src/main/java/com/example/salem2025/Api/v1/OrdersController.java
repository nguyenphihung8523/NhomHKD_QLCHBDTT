package com.example.salem2025.Api.v1;

import com.example.salem2025.repository.entity.OrdersEntity;
import com.example.salem2025.repository.entity.UserAccountEntity;
import com.example.salem2025.model.dto.CreateOrderDTO;
import com.example.salem2025.model.dto.UpdateOrderStatusDTO;
import com.example.salem2025.model.dto.OrdersDTO;
import com.example.salem2025.service.OrdersService;
import com.example.salem2025.service.UserAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/orders")
@Tag(name = "Order Management", description = "API đặt hàng và quản lý đơn hàng cho User")
public class OrdersController {

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private UserAccountService userAccountService;
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Xem đơn hàng của tôi", 
               description = "User xem danh sách đơn hàng của chính mình")
    public List<OrdersDTO> getMyOrders(
            @Parameter(description = "Lọc theo trạng thái (tùy chọn)", example = "PENDING")
            @RequestParam(required = false) String status) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        UserAccountEntity user = userAccountService.getByUsername(username);
        
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        if (status != null && !status.trim().isEmpty()) {
            return ordersService.getOrdersByUserAndStatus(user, status);
        }
        
        return ordersService.getOrdersByUser(user);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Xem chi tiết đơn hàng", 
               description = "User có thể xem chi tiết đơn hàng của mình")
    public ResponseEntity<OrdersDTO> getOrderById(
            @Parameter(description = "ID của đơn hàng", example = "1")
            @PathVariable Long id) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        String role = auth.getAuthorities().iterator().next().getAuthority();
        UserAccountEntity user = userAccountService.getByUsername(username);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (!ordersService.canUserAccessOrder(id, user, role)) {
            return ResponseEntity.status(403).build();
        }
        
        OrdersDTO order = ordersService.getOrderById(id);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(order);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Tạo đơn hàng mới", 
               description = "User tạo đơn hàng đơn giản - chỉ cần productId và quantity. Thông tin địa chỉ tự động lấy từ profile")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderDTO orderDTO) {
        System.out.println("=== OrdersController.createOrder DEBUG ===");
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication: " + auth);
            System.out.println("Principal: " + auth.getPrincipal());
            System.out.println("Authorities: " + auth.getAuthorities());
            
            String username = auth.getName();
            System.out.println("Username: " + username);
            
            UserAccountEntity user = userAccountService.getByUsername(username);
            System.out.println("User found: " + (user != null ? user.getUsername() : "null"));
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }
            
            System.out.println("Creating order for user: " + user.getUsername());
            OrdersDTO createdOrder = ordersService.createOrderForUser(orderDTO, user);
            System.out.println("Order created successfully: " + createdOrder.getId());
            return ResponseEntity.ok(createdOrder);
            
        } catch (Exception e) {
            System.out.println("Exception in createOrder: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Hủy đơn hàng của tôi", 
               description = "User có thể hủy đơn hàng của mình (chỉ trạng thái PENDING)")
    public ResponseEntity<?> cancelMyOrder(
            @Parameter(description = "ID của đơn hàng cần hủy", example = "1")
            @PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            UserAccountEntity user = userAccountService.getByUsername(username);
            
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }
            
            OrdersDTO cancelledOrder = ordersService.cancelOrderByUser(id, user);
            return ResponseEntity.ok(Map.of(
                "message", "Hủy đơn hàng thành công",
                "orderId", id,
                "status", cancelledOrder.getStatus(),
                "order", cancelledOrder
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}