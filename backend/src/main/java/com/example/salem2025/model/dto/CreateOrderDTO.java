package com.example.salem2025.model.dto;

import java.util.List;

public class CreateOrderDTO {
    
    private String notes; // Ghi chú đơn hàng (tùy chọn)
    private List<OrderItemDTO> items; // Danh sách sản phẩm

    // Default constructor
    public CreateOrderDTO() {}

    // Constructor with parameters
    public CreateOrderDTO(String notes, List<OrderItemDTO> items) {
        this.notes = notes;
        this.items = items;
    }

    // Getters and Setters
    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    // Inner class for order items
    public static class OrderItemDTO {
        private Long productId; // ID sản phẩm
        private Integer quantity; // Số lượng

        // Default constructor
        public OrderItemDTO() {}

        // Constructor with parameters
        public OrderItemDTO(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        // Getters and Setters
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}
