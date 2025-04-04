package com.example.procurement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.service.ApporRejService;
import com.example.procurement.service.GetStatusService;
import com.example.procurement.service.RequisitionService;

import java.util.List;

@RestController
public class GetStatusController {

    @Autowired
    private GetStatusService getStatusService;
    
    @Autowired
    private RequisitionService requisitionService;
    
    @Autowired
    private ApporRejService apporRejService;
    



    @GetMapping("/api/purchase-requisitions/status-options")
    public List<PurchaseRequisition> getStatusOptions(@RequestParam(required = false) String userId) {
        return requisitionService.getStatusOptions(userId);
    }

    @GetMapping("/api/purchase-requisitions/status")
    public List<PurchaseRequisition> getStatus(
            @RequestParam(required = false) String requisitionId) {
        return getStatusService.getStatus(requisitionId);
    }
    
    @GetMapping("/api/purchase-requisitions/{requisitionId}/lines")
    public List<PurchaseRequisitionLine> getRequisitionLines(@PathVariable String requisitionId) {
        return apporRejService.getRequisitionLines(requisitionId);
    }

}