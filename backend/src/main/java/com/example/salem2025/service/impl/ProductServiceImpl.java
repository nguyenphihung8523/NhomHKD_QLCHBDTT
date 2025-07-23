package com.example.salem2025.service.impl;

import com.example.salem2025.model.dto.ProductDTO;
import com.example.salem2025.repository.ProductRepository;
import com.example.salem2025.repository.entity.ProductEntity;
import com.example.salem2025.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO saveProduct(ProductDTO dto) {
        ProductEntity entity = modelMapper.map(dto, ProductEntity.class);
        entity = productRepository.save(entity);
        return modelMapper.map(entity, ProductDTO.class);
    }

    @Override
    public ProductDTO createProduct(ProductDTO dto) {
        return saveProduct(dto);
    }

    @Override
    public ProductDTO getById(Long id) {
        ProductEntity entity = productRepository.findById(id).orElse(null);
        return entity != null ? modelMapper.map(entity, ProductDTO.class) : null;
    }

    @Override
    public ProductDTO update(Long id, ProductDTO dto) {
        ProductEntity existing = productRepository.findById(id).orElse(null);
        if (existing == null) return null;

        // Update fields
        existing.setName(dto.getName());
        existing.setPrice(dto.getPrice());
        existing.setQuantity(dto.getQuantity());
        existing.setDescription(dto.getDescription());
        existing.setImageUrl(dto.getImageUrl());

        return modelMapper.map(productRepository.save(existing), ProductDTO.class);
    }

    @Override
    public boolean delete(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
