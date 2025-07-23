package com.example.salem2025.Api.v1;

import com.example.salem2025.model.dto.ProductDTO;
import com.example.salem2025.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/products/view")
@Tag(name = "Product Viewing", description = "API xem sản phẩm (Public - không cần đăng nhập)")
public class ProductViewController {

    @Autowired
    private ProductService productService;

    @GetMapping
    @Operation(summary = "Xem danh sách sản phẩm", 
               description = "Tất cả user đều có thể xem danh sách sản phẩm (không cần đăng nhập)")
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết sản phẩm", 
               description = "Tất cả user đều có thể xem chi tiết sản phẩm (không cần đăng nhập)")
    public ResponseEntity<ProductDTO> getProductById(
            @Parameter(description = "ID của sản phẩm", example = "1")
            @PathVariable Long id) {
        ProductDTO product = productService.getById(id);
        return product != null ? ResponseEntity.ok(product) : ResponseEntity.notFound().build();
    }
}
