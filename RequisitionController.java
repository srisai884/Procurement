
package com.example.procurement.controller;


import com.example.procurement.service.RequisitionService;
import com.example.procurement.repository.UserRepository;
import com.example.procurement.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.procurement.entity.PurchaseRequisition;
import com.example.procurement.entity.User;
import com.example.procurement.entity.Vendor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RequisitionController {
    @Autowired
    private RequisitionService requisitionService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @PostMapping("/requisitions")
    public ResponseEntity<?> createOrUpdateRequisition(@RequestBody PurchaseRequisition requisition) {
        PurchaseRequisition createdRequisition = requisitionService.createOrUpdateRequisition(requisition);
        return ResponseEntity.ok(Map.of("success", true, "requisitionId", createdRequisition.getRequisitionId()));
    }

    @GetMapping("/managers")
    public ResponseEntity<List<User>> getManagers() {
        List<User> managers = userRepository.findByRole("MANAGER");
        return ResponseEntity.ok(managers);
    }

    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getVendors() {
        List<Vendor> vendors = vendorRepository.findAll();
        return ResponseEntity.ok(vendors);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        User user = userRepository.findById(userId).orElse(null);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/requisitions/{requisitionId}")
    public ResponseEntity<?> deleteRequisition(@PathVariable String requisitionId) {
        boolean deleted = requisitionService.deleteRequisition(requisitionId);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Requisition not found"));
        }
    }
    
    @GetMapping("/requisition")
    public List<PurchaseRequisition> getRequisitions(@RequestParam(required = false) String requestedBy) {
        if (requestedBy != null) {
            return requisitionService.getRequisitionsByUser(requestedBy);
        } else {
            return requisitionService.getAllRequisitions();
        }
    }
    
}