package com.example.procurement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.repository.GetStatusRepository;
import com.example.procurement.repository.PurchaseRequisitionLineRepository;
import com.example.procurement.repository.PurchaseRequisitionRepository;

import java.util.List;

@Service
public class GetStatusService {

    @Autowired
    private GetStatusRepository getStatusRepository;
    


//    public List<PurchaseRequisition> getStatusOptions() {
//        return getStatusRepository.findByStatusIn(List.of("Approved", "Rejected"));
//    }

//    public List<PurchaseRequisition> getStatus(String requisitionId) {
//        if (requisitionId != null && !requisitionId.isEmpty()) {
//            return getStatusRepository.findByRequisitionIdAndStatusIn(requisitionId);
//        } else {
//            return List.of();
//        }
//    }
    
    public List<PurchaseRequisition> getStatus(String requisitionId) {
        return getStatusRepository.findByRequisitionId(requisitionId);
    }
    

}