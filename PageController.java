package com.example.procurement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/admin")
    public String adminpage() {
    	return "adminpage";
    }

    @GetMapping("/requisition")
    public String requisition() {
        return "requisition";
    }
    
    @GetMapping("/requisitionlines")
    public String requisitionLines() {
        return "requisitionlines";
    }

    @GetMapping("/purchaseorder")
    public String purchaseOrder() {
        return "purchaseorder";
    }

    @GetMapping("/getstatus")
    public String getStatus() {
        return "getstatus";
    }

    @GetMapping("/manager")
    public String managerpage() {
        return "managerpage";
    }
    
    @GetMapping("/apporrej")
    public String appOrRej() {
        return "apporrej";
    }
    
    @GetMapping("/logout")
    public String logout() {
        return "login";
    }
    
    @GetMapping("/login-success")
    public String loginsuccess() {
    	return "login-success";
    }
}