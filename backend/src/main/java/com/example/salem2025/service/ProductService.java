package com.example.salem2025.service;

import com.example.salem2025.model.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();
    ProductDTO saveProduct(ProductDTO dto);
    ProductDTO createProduct(ProductDTO dto);
    ProductDTO getById(Long id);
    ProductDTO update(Long id, ProductDTO dto);
    boolean delete(Long id);
}
