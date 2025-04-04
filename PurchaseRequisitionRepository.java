package com.example.procurement.repository;

import com.example.procurement.entity.PurchaseRequisition;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRequisitionRepository extends JpaRepository<PurchaseRequisition, String> {
    List<PurchaseRequisition> findByStatus(String status);
    List<PurchaseRequisition> findByRequestedByAndStatus(String requestedBy, String status);
//    List<PurchaseRequisition> findByRequestedByAndStatusIn(String userId);
    List<PurchaseRequisition> findByRequestedBy(String requestedBy);
}