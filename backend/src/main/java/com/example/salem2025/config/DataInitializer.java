package com.example.salem2025.config;

import com.example.salem2025.repository.ProductRepository;
import com.example.salem2025.repository.entity.ProductEntity;
import com.example.salem2025.repository.entity.UserAccountEntity;
import com.example.salem2025.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserAccountService userAccountService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Creating default admin account...");

            // Kiểm tra xem admin đã tồn tại chưa
            UserAccountEntity existingAdmin = userAccountService.getByUsername("admin");

            if (existingAdmin == null) {
                // Tạo admin account
                UserAccountEntity adminUser = new UserAccountEntity();
                adminUser.setUsername("admin");
                adminUser.setPassword(passwordEncoder.encode("admin"));
                adminUser.setRole("ADMIN");
                adminUser.setFullName("Administrator");

                userAccountService.save(adminUser);
                System.out.println("Admin account created: username=admin, password=*****");
            } else {
                System.out.println("Admin account already");
            }
        } catch (Exception e) {
            System.err.println("Error creating admin account: " + e.getMessage());
            e.printStackTrace();
        }

        try {
            System.out.println("Creating sample products...");
            if (productRepository.count() == 0) {
                ProductEntity product1 = new ProductEntity(null, "Áo thể thao nam", 250000, 100, "Áo thể thao nam thoáng mát", "http://localhost:8080/uploads/ao-the-thao-nam.jpg");
                ProductEntity product2 = new ProductEntity(null, "Quần short thể thao", 150000, 150, "Quần short thể thao co giãn", "http://localhost:8080/uploads/quan-short-the-thao.jpg");
                ProductEntity product3 = new ProductEntity(null, "Giày chạy bộ", 850000, 50, "Giày chạy bộ siêu nhẹ", "http://localhost:8080/uploads/giay-chay-bo.jpg");
                productRepository.save(product1);
                productRepository.save(product2);
                productRepository.save(product3);
                System.out.println("Sample products created.");
            } else {
                System.out.println("Products already exist.");
            }
        } catch (Exception e) {
            System.err.println("Error creating sample products: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
