package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.User;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.Program;
import com.FestOrg.FestOrg.model.ProgramBooking;
import com.FestOrg.FestOrg.repository.UserRepository;
import com.FestOrg.FestOrg.repository.FestRepository;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import com.FestOrg.FestOrg.repository.ProgramBookingRepository;
import com.FestOrg.FestOrg.service.FestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private FestService festService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FestRepository festRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private ProgramBookingRepository programBookingRepository;

    // Get pending festivals for approval
    @GetMapping("/pending-fests")
    public ResponseEntity<List<Fest>> getPendingFests() {
        List<Fest> pendingFests = festService.getFestsByStatusWithCollege("PENDING");
        return ResponseEntity.ok(pendingFests);
    }

    // Get approved public festivals
    @GetMapping("/public-fests")
    public ResponseEntity<List<Fest>> getApprovedPublicFests() {
        List<Fest> approvedFests = festService.getFestsByStatusWithCollege("APPROVED");
        return ResponseEntity.ok(approvedFests);
    }

    // Approve a festival
    @PutMapping("/fests/{id}/approve")
    public ResponseEntity<?> approveFest(@PathVariable Long id) {
        try {
            Fest fest = festRepository.findById(id).orElse(null);
            if (fest != null) {
                fest.setApprovalStatus("APPROVED");
                festRepository.save(fest);
                return ResponseEntity.ok().body(Map.of("message", "Festival approved successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to approve festival"));
        }
    }

    // Reject a festival
    @PutMapping("/fests/{id}/reject")
    public ResponseEntity<?> rejectFest(@PathVariable Long id) {
        try {
            Fest fest = festRepository.findById(id).orElse(null);
            if (fest != null) {
                fest.setApprovalStatus("REJECTED");
                festRepository.save(fest);
                return ResponseEntity.ok().body(Map.of("message", "Festival rejected successfully"));
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reject festival"));
        }
    }

    // Get dashboard statistics
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            // Count total users
            long totalUsers = userRepository.count();
            
            // Count total events (all fests)
            long totalEvents = festRepository.count();
            
            // Count active colleges (unique colleges with approved fests)
            long activeColleges = festRepository.countDistinctCollegeByApprovalStatus("APPROVED");
            
            // Count total programs
            long totalPrograms = programRepository.count();
            
            // Count pending approvals
            long pendingApprovals = festRepository.countByApprovalStatus("PENDING");
            
            // Calculate total revenue from all bookings
            double totalRevenue = programBookingRepository.findAll().stream()
                .mapToDouble(booking -> booking.getProgram().getTicketPrice())
                .sum();
            
            // Calculate growth percentage (simplified - you can make this more sophisticated)
            double growthPercentage = 12.5; // This could be calculated based on historical data
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalEvents", totalEvents);
            stats.put("activeColleges", activeColleges);
            stats.put("totalPrograms", totalPrograms);
            stats.put("pendingApprovals", pendingApprovals);
            stats.put("totalRevenue", totalRevenue);
            stats.put("growthPercentage", growthPercentage);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to fetch dashboard statistics");
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 