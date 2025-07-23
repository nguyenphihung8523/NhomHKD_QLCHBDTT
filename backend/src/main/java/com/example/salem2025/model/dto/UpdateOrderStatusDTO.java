package com.example.salem2025.model.dto;

public class UpdateOrderStatusDTO {
    
    private String status; // PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED

    // Default constructor
    public UpdateOrderStatusDTO() {}

    // Constructor with parameters
    public UpdateOrderStatusDTO(String status) {
        this.status = status;
    }

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
