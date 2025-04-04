package com.example.procurement.controller;

import com.example.procurement.entity.PurchaseRequisitionLine;


import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.Product;
import com.example.procurement.service.RequisitionLineService;
import com.example.procurement.service.RequisitionService;
import com.example.procurement.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requisition-lines")
public class RequisitionLineController {

    @Autowired
    private RequisitionLineService requisitionLineService;

    @Autowired
    private RequisitionService requisitionService;

    @Autowired
    private ProductService productService;


    
    @PostMapping
    public ResponseEntity<Map<String, String>> addRequisitionLines(@RequestBody List<PurchaseRequisitionLine> requisitionLines) {
        String requisitionId = requisitionLineService.addRequisitionLines(requisitionLines);
        Map<String, String> response = Map.of("requisitionId", requisitionId);
        return ResponseEntity.ok(response);
    }
    

    
    @GetMapping("/submitted")
    public ResponseEntity<List<PurchaseRequisition>> getSubmittedRequisitions(@RequestParam String userId) {
        List<PurchaseRequisition> submittedRequisitions = requisitionService.getSubmittedRequisitions(userId);
        return ResponseEntity.ok(submittedRequisitions);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<Product> getProductById(@PathVariable int productId) {
        Product product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }
    
    @GetMapping("/exists/{lineId}")
    public ResponseEntity<Boolean> checkLineIdExists(@PathVariable String lineId) {
        boolean exists = requisitionLineService.checkLineIdExists(lineId);
        return ResponseEntity.ok(exists);
    }
}