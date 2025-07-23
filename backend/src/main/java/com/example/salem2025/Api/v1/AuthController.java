package com.example.salem2025.Api.v1;

import com.example.salem2025.security.JwtUtil;
import com.example.salem2025.service.UserAccountService;
import com.example.salem2025.repository.entity.UserAccountEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@Tag(name = "Authentication", description = "API xác thực người dùng")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAccountService userAccountService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản mới", 
               description = "Tạo tài khoản mới với role mặc định là USER")
    @ApiResponse(responseCode = "200", description = "Đăng ký thành công")
    @ApiResponse(responseCode = "400", description = "Username đã tồn tại hoặc lỗi khác")
    public ResponseEntity<Map<String, String>> register(
            @Parameter(description = "Tên đăng nhập", example = "newuser")
            @RequestParam String username, 
            @Parameter(description = "Mật khẩu", example = "password123")
            @RequestParam String password,
            @Parameter(description = "Họ và tên đầy đủ", example = "Nguyễn Văn A")
            @RequestParam String fullName) {
        
        Map<String, String> response = new HashMap<>();
        
        try {
            if (username == null || username.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Username không được để trống");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (password == null || password.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Password không được để trống");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (fullName == null || fullName.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Họ và tên không được để trống");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (userAccountService.getByUsername(username.trim()) != null) {
                response.put("status", "error");
                response.put("message", "Username already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            UserAccountEntity newUser = new UserAccountEntity();
            newUser.setUsername(username.trim());
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setFullName(fullName.trim());
            newUser.setRole("USER");
            
            userAccountService.save(newUser);
            
            response.put("status", "success");
            response.put("message", "User registered successfully");
            response.put("username", username.trim());
            response.put("role", "USER");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập", 
               description = "Đăng nhập và nhận JWT token")
    @ApiResponse(responseCode = "200", description = "Đăng nhập thành công", 
                 content = @Content(examples = @ExampleObject(value = "{\n" +
                         "  \"status\": \"success\",\n" +
                         "  \"message\": \"Login successful\",\n" +
                         "  \"token\": \"eyJhbGciOiJIUzI1NiJ9...\",\n" +
                         "  \"username\": \"admin\",\n" +
                         "  \"role\": \"ADMIN\"\n" +
                         "}")))
    @ApiResponse(responseCode = "400", description = "Sai username hoặc password")
    public ResponseEntity<Map<String, String>> login(
            @Parameter(description = "Tên đăng nhập")
            @RequestParam String username, 
            @Parameter(description = "Mật khẩu")
            @RequestParam String password) {

        Map<String, String> response = new HashMap<>();

        try {
            if (username == null || username.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Username không được để trống");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (password == null || password.trim().isEmpty()) {
                response.put("status", "error");
                response.put("message", "Password không được để trống");
                return ResponseEntity.badRequest().body(response);
            }
            
            UserAccountEntity user = userAccountService.getByUsername(username.trim());
            
            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
                
                response.put("status", "success");
                response.put("message", "Login successful");
                response.put("token", token);
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                
                return ResponseEntity.ok(response);
            } else {
                response.put("status", "error");
                response.put("message", "Invalid username or password");
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
