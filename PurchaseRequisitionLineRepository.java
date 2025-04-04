package com.example.procurement.repository;

import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.PurchaseRequisitionLine;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseRequisitionLineRepository extends JpaRepository<PurchaseRequisitionLine, String> {
    List<PurchaseRequisitionLine> findByRequisitionId(String requisitionId);

}