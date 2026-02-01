package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Admin;
import com.FestOrg.FestOrg.model.ApprovalStatus;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.Role;
import com.FestOrg.FestOrg.repository.AdminRepository;
import com.FestOrg.FestOrg.repository.UserRepository;
import com.FestOrg.FestOrg.service.FestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final FestService festService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
//    @Autowired
//    public AdminController(AdminRepository adminRepository, UserRepository userRepository) {
//        this.adminRepository = adminRepository;
//        this.userRepository = userRepository;
//    }
    
    @Autowired
    public AdminController(AdminRepository adminRepository, UserRepository userRepository, FestService festService) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.festService = festService; 
    }
    
    @GetMapping("/pending-fests")
    public ResponseEntity<List<Fest>> getPendingFests() {
        return ResponseEntity.ok(festService.getFestsByStatusWithCollege(ApprovalStatus.PENDING));
    }

    @GetMapping("/public-fests")
    public ResponseEntity<List<Fest>> getApprovedPublicFests() {
        return ResponseEntity.ok(festService.getFestsByStatusWithCollege(ApprovalStatus.APPROVED));
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Admin adminRequest) {
       
        if (userRepository.findByUsername(adminRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        if (userRepository.findByEmail(adminRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        if (adminRepository.count() >= 2) {
            return ResponseEntity.badRequest().body("Maximum number of admins reached.");
        }
        
        adminRequest.setRole(Role.ADMIN);
        adminRequest.setCreatedAt(LocalDateTime.now());
        
        adminRequest.setPassword(passwordEncoder.encode(adminRequest.getPassword())); 

        Admin savedAdmin = adminRepository.save(adminRequest);
        return ResponseEntity.ok(savedAdmin);
    }
}
