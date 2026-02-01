package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.ApprovalStatus;
import com.FestOrg.FestOrg.service.FestService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminFestController {
    
    private final FestService festService;

    @Autowired
    public AdminFestController(FestService festService) {
        this.festService = festService;
    }

    @GetMapping("/pending-fests")
    public ResponseEntity<List<Fest>> getPendingFests() {
        return ResponseEntity.ok(festService.getFestsByStatus(ApprovalStatus.PENDING));
    }

    @PutMapping("/fests/{festId}/approve")
    public ResponseEntity<Fest> approveFest(@PathVariable Long festId) {
        return ResponseEntity.ok(festService.updateApprovalStatus(festId, ApprovalStatus.APPROVED));
    }

    @PutMapping("/fests/{festId}/reject")
    public ResponseEntity<Fest> rejectFest(@PathVariable Long festId) {
        return ResponseEntity.ok(festService.updateApprovalStatus(festId, ApprovalStatus.REJECTED));
    }

    @GetMapping("/public-fests")
    public ResponseEntity<List<Fest>> getApprovedPublicFests() {
        return ResponseEntity.ok(festService.getApprovedPublicFests());
    }
}
