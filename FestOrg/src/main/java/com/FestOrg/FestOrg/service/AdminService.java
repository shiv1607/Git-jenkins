package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.Admin;
import com.FestOrg.FestOrg.model.Role;
import com.FestOrg.FestOrg.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Only if you use Spring Security

    public Admin createAdmin(Admin admin) {
        if (adminRepository.count() >= 2) {
            throw new IllegalStateException("Maximum number of admins reached.");
        }

        admin.setRole(Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());

        // Optional: Encode password
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));

        return adminRepository.save(admin);
    }
}
 