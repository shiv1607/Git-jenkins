package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.College;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.Role;  
import com.FestOrg.FestOrg.service.CollegeService;
import com.FestOrg.FestOrg.service.FestService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    private final CollegeService collegeService;
    private final PasswordEncoder passwordEncoder;
    private final FestService festService;  

    public CollegeController(CollegeService collegeService, PasswordEncoder passwordEncoder, FestService festService) {
        this.collegeService = collegeService;
        this.passwordEncoder = passwordEncoder;
        this.festService = festService; 
    }

    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        college.setPassword(passwordEncoder.encode(college.getPassword()));
        college.setRole(Role.COLLEGE);  
        College savedCollege = collegeService.createCollege(college);
        return ResponseEntity.ok(savedCollege);
    }
    
    

    @GetMapping("/{collegeId}/fests")
    public ResponseEntity<List<Fest>> getFestsByCollege(@PathVariable Long collegeId) {
        try {
            List<Fest> fests = festService.getFestsByCollegeId(collegeId);
            return ResponseEntity.ok(fests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null);
        }
    }
    
    @DeleteMapping("/{collegeId}/fests/{festId}")
    public ResponseEntity<String> deleteFest(
            @PathVariable Long collegeId,
            @PathVariable Long festId) {

        try {
            String message = collegeService.deleteFestByCollege(festId, collegeId);
            return ResponseEntity.ok(message);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }
}