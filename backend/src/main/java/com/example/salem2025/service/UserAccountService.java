package com.example.salem2025.service;

import com.example.salem2025.repository.UserAccountRepository;
import com.example.salem2025.repository.entity.UserAccountEntity;
import com.example.salem2025.repository.ProductRepository;
import com.example.salem2025.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserAccountService {

    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrdersRepository ordersRepository;

    public UserAccountEntity getByUsername(String username) {
        return userAccountRepository.findByUsername(username).orElse(null);
    }
    
    public UserAccountEntity save(UserAccountEntity user) {
        return userAccountRepository.save(user);
    }
    
    public UserAccountEntity findById(Long id) {
        return userAccountRepository.findById(id).orElse(null);
    }
    
    public List<UserAccountEntity> getAllUsers() {
        return userAccountRepository.findAll();
    }
    
    public void deleteById(Long id) {
        userAccountRepository.deleteById(id);
    }
    
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalUsers = userAccountRepository.count();
        long totalProducts = productRepository.count();
        long totalOrders = ordersRepository.count();
        long adminCount = userAccountRepository.countByRole("ADMIN");
        long userCount = userAccountRepository.countByRole("USER");
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("adminCount", adminCount);
        stats.put("userCount", userCount);
        
        return stats;
    }
    
    public boolean isProfileComplete(UserAccountEntity user) {
        return user.getAddress() != null && !user.getAddress().trim().isEmpty() 
            && user.getPhone() != null && !user.getPhone().trim().isEmpty();
    }
}
