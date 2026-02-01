package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.FestOrg.FestOrg.model.Program;
import com.FestOrg.FestOrg.repository.ProgramRepository;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {

    @Autowired
    private ExcelService excelService;
    
    @Autowired
    private ProgramRepository programRepository;

    @GetMapping("/college-bookings/{collegeId}")
    public ResponseEntity<byte[]> downloadCollegeBookings(@PathVariable Long collegeId) {
        System.out.println("🎯 DEBUG: Excel download requested for college ID: " + collegeId);
        System.out.println("📅 DEBUG: Request timestamp: " + LocalDateTime.now());
        
        try {
            System.out.println("🔄 DEBUG: Calling ExcelService.generateCollegeBookingsExcel...");
            byte[] excelData = excelService.generateCollegeBookingsExcel(collegeId);
            System.out.println("✅ DEBUG: ExcelService returned data of size: " + excelData.length + " bytes");
            
            String fileName = "college_bookings_" + collegeId + "_" + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";
            System.out.println("📄 DEBUG: Generated filename: " + fileName);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileName);
            System.out.println("�� DEBUG: Headers set successfully");
            
            System.out.println("✅ DEBUG: Returning successful response with " + excelData.length + " bytes");
            return ResponseEntity.ok()
                .headers(headers)
                .body(excelData);
                
        } catch (IOException e) {
            System.err.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            System.err.println("❌ UNEXPECTED ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    // Test endpoint to check data
    @GetMapping("/test-college-data/{collegeId}")
    public ResponseEntity<?> testCollegeData(@PathVariable Long collegeId) {
        try {
            System.out.println("🧪 TEST: Checking data for college ID: " + collegeId);
            
            // Test the query directly
            List<Program> programs = programRepository.findByFestCollegeId(collegeId);
            
            Map<String, Object> result = new HashMap<>();
            result.put("collegeId", collegeId);
            result.put("programsFound", programs.size());
            result.put("programs", programs.stream().map(p -> Map.of(
                "id", p.getId(),
                "title", p.getTitle(),
                "festTitle", p.getFest().getTitle()
            )).collect(Collectors.toList()));
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("❌ TEST ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}