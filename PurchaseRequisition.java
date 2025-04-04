package com.example.procurement.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class PurchaseRequisition {
    @Id
    private String requisitionId;
    private String requestedBy;
    private Date requestedDate;
    private Date expectedDate;
    private String managerName;
    private String vendorName;
    private String status;
    
   
    // Getters and Setters
    public String getRequisitionId() {
        return requisitionId;
    }

    public void setRequisitionId(String requisitionId) {
        this.requisitionId = requisitionId;
    }

    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    public Date getRequestedDate() {
        return requestedDate;
    }

    public void setRequestedDate(Date requestedDate) {
        this.requestedDate = requestedDate;
    }

    public Date getExpectedDate() {
        return expectedDate;
    }

    public void setExpectedDate(Date expectedDate) {
        this.expectedDate = expectedDate;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getStatus() {
        return status;	
    }

    public void setStatus(String status) {
        this.status = status;
    }

    

    
    
    
}