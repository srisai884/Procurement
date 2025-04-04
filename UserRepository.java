package com.example.procurement.repository;

import com.example.procurement.entity.User;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findByUserId(String userId);
    List<User> findByRole(String role);
    User findByUsername(String username);
}