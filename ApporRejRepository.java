package com.example.procurement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.procurement.entity.PurchaseRequisition;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ApporRejRepository extends JpaRepository<PurchaseRequisition, String> {
    @Query("SELECT pr FROM PurchaseRequisition pr WHERE " +
           "(pr.requestedBy = :requestedBy OR :requestedBy IS NULL) AND " +
           "(pr.requisitionId = :requisitionId OR :requisitionId IS NULL) AND " +
           "(DATE(pr.requestedDate) = :requestedDate OR :requestedDate IS NULL) AND " +
           "pr.status = 'Submitted'")
    List<PurchaseRequisition> findByCriteria(@Param("requestedBy") String requestedBy,
                                             @Param("requisitionId") String requisitionId,
                                             @Param("requestedDate") LocalDate requestedDate);
    
    @Query("SELECT DISTINCT pr.requestedBy FROM PurchaseRequisition pr WHERE pr.status = 'Submitted'")
    List<String> findDistinctRequestedByWithSubmittedStatus();

    @Query("SELECT pr.requisitionId FROM PurchaseRequisition pr WHERE pr.status = 'Submitted'")
    List<String> findRequisitionIdsWithSubmittedStatus();
}