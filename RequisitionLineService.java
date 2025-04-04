package com.example.procurement.service;

import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.repository.PurchaseRequisitionLineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequisitionLineService {

    @Autowired
    private PurchaseRequisitionLineRepository requisitionLineRepository;

    public String addRequisitionLines(List<PurchaseRequisitionLine> requisitionLines) {
        requisitionLineRepository.saveAll(requisitionLines);
        return requisitionLines.get(0).getRequisitionId();
    }
    
//    public List<PurchaseRequisitionLine> addRequisitionLines(List<PurchaseRequisitionLine> requisitionLines) {
//        requisitionLineRepository.saveAll(requisitionLines);
//        return requisitionLines.get(0).getRequisitionId();
//    }
    
    public boolean checkLineIdExists(String lineId) {
        return requisitionLineRepository.existsById(lineId);
    }
}