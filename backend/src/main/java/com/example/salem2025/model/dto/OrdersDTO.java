package com.example.salem2025.model.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrdersDTO {
    private Long id;
    private LocalDateTime orderDate;
    private String status;
    private String notes;
    private CustomerDTO customer;
    private UserAccountSummaryDTO userAccount;
    private List<OrderDetailDTO> orderDetails;

    // Constructors
    public OrdersDTO() {}

    public OrdersDTO(Long id, LocalDateTime orderDate, String status, String notes) {
        this.id = id;
        this.orderDate = orderDate;
        this.status = status;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    public UserAccountSummaryDTO getUserAccount() {
        return userAccount;
    }

    public void setUserAccount(UserAccountSummaryDTO userAccount) {
        this.userAccount = userAccount;
    }

    public List<OrderDetailDTO> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetailDTO> orderDetails) {
        this.orderDetails = orderDetails;
    }

    // Inner DTOs for cleaner response
    public static class CustomerDTO {
        private Long id;
        private String name;
        private String phone;
        private String email;
        private String address;

        public CustomerDTO() {}

        public CustomerDTO(Long id, String name, String phone, String email, String address) {
            this.id = id;
            this.name = name;
            this.phone = phone;
            this.email = email;
            this.address = address;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class UserAccountSummaryDTO {
        private Long id;
        private String username;
        private String role;
        private String fullName;
        private String email;
        private String phone;
        private String address;

        public UserAccountSummaryDTO() {}

        public UserAccountSummaryDTO(Long id, String username, String role, String fullName, String email, String phone, String address) {
            this.id = id;
            this.username = username;
            this.role = role;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.address = address;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPhone() {
            return phone;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }

    public static class OrderDetailDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productImageUrl; // Add this
        private Integer quantity;
        private Double unitPrice;
        private Double totalPrice;

        public OrderDetailDTO() {}

        public OrderDetailDTO(Long id, Long productId, String productName, String productImageUrl, Integer quantity, Double unitPrice, Double totalPrice) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.productImageUrl = productImageUrl;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
            this.totalPrice = totalPrice;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductImageUrl() {
            return productImageUrl;
        }

        public void setProductImageUrl(String productImageUrl) {
            this.productImageUrl = productImageUrl;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(Double unitPrice) {
            this.unitPrice = unitPrice;
        }

        public Double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(Double totalPrice) {
            this.totalPrice = totalPrice;
        }
    }
}
