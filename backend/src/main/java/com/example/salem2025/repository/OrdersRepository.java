package com.example.salem2025.repository;

import com.example.salem2025.repository.entity.OrdersEntity;
import com.example.salem2025.repository.entity.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdersRepository extends JpaRepository<OrdersEntity, Long> {
    List<OrdersEntity> findByUserAccount(UserAccountEntity userAccount);
    List<OrdersEntity> findByUserAccountOrderByOrderDateDesc(UserAccountEntity userAccount);
    List<OrdersEntity> findByStatus(String status);
    List<OrdersEntity> findByUserAccountAndStatus(UserAccountEntity userAccount, String status);
}
