package com.example.procurement.controller;

import com.example.procurement.entity.PurchaseOrder;
import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.service.PurchaseOrderService;
import com.example.procurement.service.RequisitionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchaseOrders")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    @Autowired
    private RequisitionService requisitionService;

    @GetMapping("/requisitions/approved")
    public List<PurchaseRequisition> getApprovedRequisitions(@RequestParam String userId) {
        return requisitionService.getApprovedRequisitions(userId);
    }

    @GetMapping("/requisitions/{id}")
    public PurchaseRequisition getRequisitionDetails(@PathVariable String id) {
        return requisitionService.getRequisitionDetails(id);
    }

    @GetMapping("/requisitionLines/{requisitionId}")
    public List<PurchaseRequisitionLine> getRequisitionLines(@PathVariable String requisitionId) {
        return requisitionService.getRequisitionLines(requisitionId);
    }
    
    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @PostMapping
    public PurchaseOrder createOrUpdatePurchaseOrder(@RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.createOrUpdatePurchaseOrder(purchaseOrder);
    }
    
    @GetMapping("/status")
    public List<PurchaseOrder> getPurchaseOrderStatus(@RequestParam String requisitionId) {
        return purchaseOrderService.getPurchaseOrderStatus(requisitionId);
    }
}