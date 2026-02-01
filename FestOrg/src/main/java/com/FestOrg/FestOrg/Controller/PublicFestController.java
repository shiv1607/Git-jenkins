package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.service.FestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/fests")
public class PublicFestController {

    private final FestService festService;

    public PublicFestController(FestService festService) {
        this.festService = festService;
    }

    //Get all approved + public fests
    @GetMapping
    public ResponseEntity<List<Fest>> getApprovedPublicFests() {
        List<Fest> publicFests = festService.getApprovedPublicFests();  
        return ResponseEntity.ok(publicFests);
    }

    //Get individual fest details by ID
    @GetMapping("/{festId}")
    public ResponseEntity<?> getFestDetails(@PathVariable Long festId) {
        Fest fest = festService.getFestById(festId);
        if (fest == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(fest);
    }
}
