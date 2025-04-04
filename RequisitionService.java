

package com.example.procurement.service;

import com.example.procurement.entity.PurchaseOrder;
import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.repository.PurchaseRequisitionLineRepository;
import com.example.procurement.repository.PurchaseRequisitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RequisitionService {
    @Autowired
    private PurchaseRequisitionRepository purchaseRequisitionRepository;
    
    @Autowired
    private PurchaseRequisitionLineRepository purchaseRequisitionLineRepository;
    	


    
    public PurchaseRequisition createOrUpdateRequisition(PurchaseRequisition requisition) {
        if (requisition.getRequisitionId() == null || requisition.getRequisitionId().isEmpty()) {
            String requisitionId = generateRequisitionId(requisition.getRequestedBy());
            requisition.setRequisitionId(requisitionId);
            requisition.setRequestedDate(new Date());
        } else {
            Optional<PurchaseRequisition> existingRequisition = purchaseRequisitionRepository.findById(requisition.getRequisitionId());
            if (existingRequisition.isPresent()) {
                PurchaseRequisition existing = existingRequisition.get();
                existing.setStatus(requisition.getStatus());
                existing.setExpectedDate(requisition.getExpectedDate());
                existing.setManagerName(requisition.getManagerName());
                existing.setVendorName(requisition.getVendorName());
                return purchaseRequisitionRepository.save(existing);
            }
        }
        return purchaseRequisitionRepository.save(requisition);
    }

    private String generateRequisitionId(String userId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        String datetime = sdf.format(new Date());
        return "REQ-" + userId + "-" + datetime;
    }
    

    
    public List<PurchaseRequisition> getSubmittedRequisitions(String requestedby) {
        return purchaseRequisitionRepository.findByRequestedByAndStatus(requestedby, "Submitted");
    }
    
    public List<PurchaseRequisition> getApprovedRequisitions(String userId) {
        return purchaseRequisitionRepository.findByRequestedByAndStatus(userId, "Approved");
    }
    
    public PurchaseRequisition getRequisitionDetails(String id) {
        return purchaseRequisitionRepository.findById(id).orElse(null);
    }
    
    public List<PurchaseRequisitionLine> getRequisitionLines(String requisitionId) {
        return purchaseRequisitionLineRepository.findByRequisitionId(requisitionId);
    }
    
    public List<PurchaseRequisition> getStatusOptions(String userId) {
        return purchaseRequisitionRepository.findByRequestedBy(userId);
    }
    
    public boolean deleteRequisition(String requisitionId) {
        Optional<PurchaseRequisition> requisition = purchaseRequisitionRepository.findById(requisitionId);
        if (requisition.isPresent()) {
            purchaseRequisitionRepository.delete(requisition.get());
            return true;
        } else {
            return false;
        }
    }
    
    public List<PurchaseRequisition> getAllRequisitions() {
        return purchaseRequisitionRepository.findAll();
    }
    
    public List<PurchaseRequisition> getRequisitionsByUser(String username) {
        return purchaseRequisitionRepository.findByRequestedBy(username);
    }
    
}