package com.example.procurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;

import java.util.List;

public interface GetStatusRepository extends JpaRepository<PurchaseRequisition, String> {
    List<PurchaseRequisition> findByStatusIn(List<String> statuses);
    List<PurchaseRequisition> findByRequisitionId(String requisitionId);

}