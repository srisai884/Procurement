package com.example.procurement.service;

import com.example.procurement.entity.PurchaseOrder;
import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.repository.PurchaseOrderRepository;
import com.example.procurement.repository.PurchaseRequisitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    @Autowired
    private PurchaseRequisitionRepository purchaseRequisitionRepository;



    public PurchaseRequisition getRequisitionDetails(String id) {
        return purchaseRequisitionRepository.findById(id).orElse(null);
    }
    
    
    public PurchaseOrder createOrUpdatePurchaseOrder(PurchaseOrder purchaseOrder) {
        if (purchaseOrder.getPurchaseOrderId() == null || purchaseOrder.getPurchaseOrderId().isEmpty()) {
            String purchaseOrderId = generatePurchaseOrderId();
            purchaseOrder.setPurchaseOrderId(purchaseOrderId);
        } else {
            Optional<PurchaseOrder> existingOrder = purchaseOrderRepository.findById(purchaseOrder.getPurchaseOrderId());
            if (existingOrder.isPresent()) {
                PurchaseOrder existing = existingOrder.get();
                existing.setOrderStatus(purchaseOrder.getOrderStatus());
                existing.setDeliveryDate(purchaseOrder.getDeliveryDate());
                existing.setItems(purchaseOrder.getItems());
                existing.setTotalAmount(purchaseOrder.getTotalAmount());
                return purchaseOrderRepository.save(existing);
            }
        }
        return purchaseOrderRepository.save(purchaseOrder);
    }
    

    private String generatePurchaseOrderId() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String datetime = sdf.format(new Date());
        return "PO-" + "-" + datetime;
    }
    
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }
    
    public List<PurchaseOrder> getPurchaseOrderStatus(String requisitionId) {
        return purchaseOrderRepository.findByRequisitionId(requisitionId);
    }
}
