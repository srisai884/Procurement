package com.example.procurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.procurement.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Product findByProductCode(String productCode);
    
}
