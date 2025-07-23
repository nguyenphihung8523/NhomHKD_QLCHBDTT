package com.example.salem2025.service.impl;

import com.example.salem2025.model.dto.CreateOrderDTO;
import com.example.salem2025.model.dto.OrdersDTO;
import com.example.salem2025.model.dto.UpdateOrderStatusDTO;
import com.example.salem2025.repository.CustomerRepository;
import com.example.salem2025.repository.OrdersRepository;
import com.example.salem2025.repository.ProductRepository;
import com.example.salem2025.repository.entity.*;
import com.example.salem2025.service.OrdersService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdersServiceImpl implements OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<OrdersDTO> getAllOrders() {
        return ordersRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDTO saveOrder(OrdersDTO dto) {
        OrdersEntity entity = modelMapper.map(dto, OrdersEntity.class);
        entity = ordersRepository.save(entity);
        return toDto(entity);
    }

    @Override
    public List<OrdersDTO> getOrdersByStatus(String status) {
        // This is a placeholder. You might need a specific query in your repository
        return ordersRepository.findAll().stream()
                .filter(order -> status.equalsIgnoreCase(order.getStatus()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDTO getOrderById(Long id) {
        return ordersRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    @Transactional
    public OrdersDTO updateOrderStatus(Long id, UpdateOrderStatusDTO dto) {
        OrdersEntity order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        order.setStatus(dto.getStatus());
        return toDto(ordersRepository.save(order));
    }

    @Override
    @Transactional
    public boolean deleteOrder(Long id) {
        if (ordersRepository.existsById(id)) {
            ordersRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<OrdersDTO> getOrdersByUserAndStatus(UserAccountEntity user, String status) {
        // This is a placeholder. You might need a specific query in your repository
        return ordersRepository.findAll().stream()
                .filter(order -> order.getUserAccount().getId().equals(user.getId()) && status.equalsIgnoreCase(order.getStatus()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrdersDTO> getOrdersByUser(UserAccountEntity user) {
        // This is a placeholder. You might need a specific query in your repository
        return ordersRepository.findAll().stream()
                .filter(order -> order.getUserAccount().getId().equals(user.getId()))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public boolean canUserAccessOrder(Long orderId, UserAccountEntity user, String role) {
        if (role != null && role.contains("ADMIN")) {
            return true;
        }
        return ordersRepository.findById(orderId)
                .map(order -> order.getUserAccount().getId().equals(user.getId()))
                .orElse(false);
    }

    @Override
    @Transactional
    public OrdersDTO createOrderForUser(CreateOrderDTO dto, UserAccountEntity user) {
        System.out.println("--- Starting to create order for user: " + user.getUsername() + " ---");

        // Step 1: Find or create a customer record
        CustomerEntity customer = customerRepository.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    System.out.println("Customer not found for email: " + user.getEmail() + ". Creating new customer.");
                    CustomerEntity newCustomer = new CustomerEntity();
                    newCustomer.setName(user.getFullName());
                    newCustomer.setPhone(user.getPhone());
                    newCustomer.setEmail(user.getEmail());
                    newCustomer.setAddress(user.getAddress());
                    return customerRepository.save(newCustomer);
                });
        System.out.println("Using customer with ID: " + customer.getId());

        OrdersEntity order = new OrdersEntity();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING");
        order.setNotes(dto.getNotes());
        order.setUserAccount(user);
        order.setCustomer(customer);

        List<OrderDetailEntity> details = new ArrayList<>();
        for (CreateOrderDTO.OrderItemDTO itemDto : dto.getItems()) {
            System.out.println("Processing item - ProductID: " + itemDto.getProductId() + ", Quantity: " + itemDto.getQuantity());

            ProductEntity product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id: " + itemDto.getProductId()));
            System.out.println("Found product: " + product.getName() + ", Available quantity: " + product.getQuantity());

            if (product.getQuantity() < itemDto.getQuantity()) {
                System.err.println("ERROR: Not enough stock for product: " + product.getName());
                throw new RuntimeException("Not enough stock for product: " + product.getName() + ". Required: " + itemDto.getQuantity() + ", Available: " + product.getQuantity());
            }

            OrderDetailEntity detail = new OrderDetailEntity();
            detail.setOrder(order);
            detail.setProduct(product);
            detail.setQuantity(itemDto.getQuantity());
            detail.setUnitPrice(product.getPrice());
            details.add(detail);

            // Decrease product stock
            product.setQuantity(product.getQuantity() - itemDto.getQuantity());
            productRepository.save(product);
            System.out.println("Updated stock for product: " + product.getName());
        }

        order.setOrderDetails(details);
        OrdersEntity savedOrder = ordersRepository.save(order);
        System.out.println("--- Order created successfully with ID: " + savedOrder.getId() + " ---");
        return toDto(savedOrder);
    }

    @Override
    @Transactional
    public OrdersDTO cancelOrderByUser(Long orderId, UserAccountEntity user) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (!order.getUserAccount().getId().equals(user.getId())) {
            throw new SecurityException("User does not have permission to cancel this order");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only orders with PENDING status can be cancelled.");
        }

        // Restore product stock
        for (OrderDetailEntity detail : order.getOrderDetails()) {
            ProductEntity product = detail.getProduct();
            product.setQuantity(product.getQuantity() + detail.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        return toDto(ordersRepository.save(order));
    }

    private OrdersDTO toDto(OrdersEntity entity) {
        OrdersDTO dto = new OrdersDTO();
        dto.setId(entity.getId());
        dto.setOrderDate(entity.getOrderDate());
        dto.setStatus(entity.getStatus());
        dto.setNotes(entity.getNotes());

        if (entity.getCustomer() != null) {
            CustomerEntity customer = entity.getCustomer();
            OrdersDTO.CustomerDTO customerDTO = new OrdersDTO.CustomerDTO(
                    customer.getId(),
                    customer.getName(),
                    customer.getPhone(),
                    customer.getEmail(),
                    customer.getAddress()
            );
            dto.setCustomer(customerDTO);
        }

        if (entity.getUserAccount() != null) {
            UserAccountEntity user = entity.getUserAccount();
            OrdersDTO.UserAccountSummaryDTO userDto = new OrdersDTO.UserAccountSummaryDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getRole(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getPhone(),
                    user.getAddress()
            );
            dto.setUserAccount(userDto);
        }

        if (entity.getOrderDetails() != null) {
            List<OrdersDTO.OrderDetailDTO> detailDtos = entity.getOrderDetails().stream()
                    .map(detail -> {
                        OrdersDTO.OrderDetailDTO detailDto = new OrdersDTO.OrderDetailDTO();
                        detailDto.setId(detail.getId());
                        detailDto.setQuantity(detail.getQuantity());
                        detailDto.setUnitPrice(detail.getUnitPrice());
                        if (detail.getProduct() != null) {
                            detailDto.setProductId(detail.getProduct().getId());
                            detailDto.setProductName(detail.getProduct().getName());
                            detailDto.setProductImageUrl(detail.getProduct().getImageUrl());
                        }
                        if (detail.getQuantity() != null && detail.getUnitPrice() != null) {
                            detailDto.setTotalPrice(detail.getQuantity() * detail.getUnitPrice());
                        }
                        return detailDto;
                    })
                    .collect(Collectors.toList());
            dto.setOrderDetails(detailDtos);
        } else {
            dto.setOrderDetails(Collections.emptyList());
        }

        return dto;
    }
}
