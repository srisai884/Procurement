//package com.example.procurement.controller;
//
//
//import com.example.procurement.entity.User;
//import com.example.procurement.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api")
//public class LoginController {
//
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
//        String userId = loginRequest.get("userId");
//        String password = loginRequest.get("password");
//        String role = loginRequest.get("role");
//
//        try {
//            Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(userId, password)
//            );
//
//            User user = userRepository.findByUserId(userId);
//            if (user != null && user.getRole().equals(role)) {
//                Map<String, Object> response = new HashMap<>();
//                response.put("success", true);
//                response.put("role", user.getRole());
//                return ResponseEntity.ok(response);
//            } else {
//                Map<String, Object> response = new HashMap<>();
//                response.put("success", false);
//                response.put("message", "Invalid user ID, password, or role.");
//                return ResponseEntity.status(401).body(response);
//            }
//        } catch (AuthenticationException e) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", false);
//            response.put("message", "Authentication failed.");
//            return ResponseEntity.status(401).body(response);
//        }
//    }
//}