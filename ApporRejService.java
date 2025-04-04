package com.example.procurement.service;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.repository.ApporRejRepository;
import com.example.procurement.repository.PurchaseRequisitionLineRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApporRejService {

    @Autowired
    private ApporRejRepository apporRejRepository;

    @Autowired
    private PurchaseRequisitionLineRepository purchaseRequisitionLinesRepository;

    public List<PurchaseRequisition> searchRequisitions(String requestedBy, String requisitionId, LocalDate requestedDate) {
    	
    	return apporRejRepository.findByCriteria(requestedBy, requisitionId, requestedDate);
    }

    public PurchaseRequisition updateRequisitionStatus(String requisitionId, String status) {
        PurchaseRequisition requisition = apporRejRepository.findById(requisitionId).orElseThrow(() -> new RuntimeException("Requisition not found"));
        requisition.setStatus(status);
        return apporRejRepository.save(requisition);
    }

    public List<PurchaseRequisitionLine> getRequisitionLines(String requisitionId) {
        return purchaseRequisitionLinesRepository.findByRequisitionId(requisitionId);
    }
    
    public List<String> getAllRequestedBy() {
        return apporRejRepository.findDistinctRequestedByWithSubmittedStatus();
    }

    public List<String> getAllRequisitionIds() {
        return apporRejRepository.findRequisitionIdsWithSubmittedStatus();
    }
}