package com.example.salem2025.service;

import com.example.salem2025.model.dto.CreateOrderDTO;
import com.example.salem2025.model.dto.OrdersDTO;
import com.example.salem2025.model.dto.UpdateOrderStatusDTO;
import com.example.salem2025.repository.entity.UserAccountEntity;

import java.util.List;

public interface OrdersService {
    List<OrdersDTO> getAllOrders();
    OrdersDTO saveOrder(OrdersDTO dto);
    List<OrdersDTO> getOrdersByStatus(String status);
    OrdersDTO getOrderById(Long id);
    OrdersDTO updateOrderStatus(Long id, UpdateOrderStatusDTO dto);
    boolean deleteOrder(Long id);
    List<OrdersDTO> getOrdersByUserAndStatus(UserAccountEntity user, String status);
    List<OrdersDTO> getOrdersByUser(UserAccountEntity user);
    boolean canUserAccessOrder(Long orderId, UserAccountEntity user, String role);
    OrdersDTO createOrderForUser(CreateOrderDTO dto, UserAccountEntity user);
    OrdersDTO cancelOrderByUser(Long orderId, UserAccountEntity user);
}
