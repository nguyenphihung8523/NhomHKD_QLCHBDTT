package com.example.salem2025.Api.v1;

import com.example.salem2025.service.UserAccountService;
import com.example.salem2025.repository.entity.UserAccountEntity;
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

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/user")
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
@Tag(name = "User Management", description = "API dành cho User (Cần đăng nhập)")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserAccountService userAccountService;

    @GetMapping("/profile")
    @Operation(summary = "Thông tin profile", 
               description = "Xem thông tin cá nhân của user hiện tại")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            UserAccountEntity user = userAccountService.getByUsername(username);
            if (user != null) {
                Map<String, Object> profile = new HashMap<>();
                profile.put("id", user.getId());
                profile.put("username", user.getUsername());
                profile.put("fullName", user.getFullName());
                profile.put("email", user.getEmail());
                profile.put("phone", user.getPhone());
                profile.put("address", user.getAddress());
                profile.put("role", user.getRole());
                
                response.put("status", "success");
                response.put("profile", profile);
            } else {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to get profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Cập nhật profile", 
               description = "Cập nhật thông tin cá nhân (họ tên, email, SĐT, địa chỉ)")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @Parameter(description = "Họ và tên")
            @RequestParam(required = false) String fullName,
            @Parameter(description = "Email")
            @RequestParam(required = false) String email,
            @Parameter(description = "Số điện thoại")
            @RequestParam(required = false) String phone,
            @Parameter(description = "Địa chỉ")
            @RequestParam(required = false) String address) {
        
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            UserAccountEntity user = userAccountService.getByUsername(username);
            if (user != null) {
                // Cập nhật thông tin nếu có
                if (fullName != null && !fullName.trim().isEmpty()) {
                    user.setFullName(fullName.trim());
                }
                if (email != null && !email.trim().isEmpty()) {
                    user.setEmail(email.trim());
                }
                if (phone != null && !phone.trim().isEmpty()) {
                    user.setPhone(phone.trim());
                }
                if (address != null && !address.trim().isEmpty()) {
                    user.setAddress(address.trim());
                }
                
                userAccountService.save(user);
                
                response.put("status", "success");
                response.put("message", "Profile updated successfully");
                response.put("profile", Map.of(
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "phone", user.getPhone(),
                    "address", user.getAddress()
                ));
            } else {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/profile/status")
    @Operation(summary = "Kiểm tra tình trạng profile", 
               description = "Kiểm tra xem profile đã đủ thông tin để đặt hàng chưa (address và phone)")
    public ResponseEntity<Map<String, Object>> getProfileStatus() {
        Map<String, Object> response = new HashMap<>();
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            
            UserAccountEntity user = userAccountService.getByUsername(username);
            if (user != null) {
                boolean isComplete = userAccountService.isProfileComplete(user);
                
                response.put("status", "success");
                response.put("profileComplete", isComplete);
                response.put("hasAddress", user.getAddress() != null && !user.getAddress().trim().isEmpty());
                response.put("hasPhone", user.getPhone() != null && !user.getPhone().trim().isEmpty());
                
                if (!isComplete) {
                    response.put("message", "Please update your address and phone number to place orders");
                } else {
                    response.put("message", "Profile is complete");
                }
            } else {
                response.put("status", "error");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to check profile status: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
