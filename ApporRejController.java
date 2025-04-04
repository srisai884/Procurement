package com.example.procurement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;
import com.example.procurement.service.ApporRejService;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/requisitions")
public class ApporRejController {

    @Autowired
    private ApporRejService apporRejService;

    @GetMapping
    public List<PurchaseRequisition> searchRequisitions(@RequestParam(required = false) String requestedBy,
                                                        @RequestParam(required = false) String requisitionId,
                                                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestedDate) {
        return apporRejService.searchRequisitions(requestedBy, requisitionId, requestedDate);
    }

    @PutMapping("/{requisitionId}/status/{status}")
    public PurchaseRequisition updateRequisitionStatus(@PathVariable String requisitionId, @PathVariable String status) {
        return apporRejService.updateRequisitionStatus(requisitionId, status);
    }

    @GetMapping("/{requisitionId}/lines")
    public List<PurchaseRequisitionLine> getRequisitionLines(@PathVariable String requisitionId) {
        return apporRejService.getRequisitionLines(requisitionId);
    }
    
    @GetMapping("/requestedBy")
    public List<String> getRequestedByOptions() {
        return apporRejService.getAllRequestedBy();
    }

    @GetMapping("/requisitionIds")
    public List<String> getRequisitionIdOptions() {
        return apporRejService.getAllRequisitionIds();
    }
}	