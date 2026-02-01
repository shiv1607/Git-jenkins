package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.EventCategory;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.FestRequest;
import com.FestOrg.FestOrg.service.FestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/college-fests") // Unique Path
public class CollegeFestController {

    @Autowired
    private FestService festService;

    @PostMapping("/{collegeId}") // Correct annotation and path
    public Fest createFest(@PathVariable Long collegeId, @RequestBody FestRequest request) {

        Fest fest = new Fest();
        
        // Set all fields from the request DTO
        fest.setTitle(request.getTitle());
        fest.setDescription(request.getDescription());
        fest.setStartDate(request.getStartDate());
        fest.setEndDate(request.getEndDate());
        fest.setSeatLimit(request.getSeatLimit());
        fest.setTicketPrice(request.getTicketPrice());
        fest.setImageUrl(request.getImageUrl());
        fest.setSubCategory(request.getSubCategory());
        fest.setTags(request.getTags());

        // Validate and set the category
        if (request.getCategory() == null || request.getCategory().isEmpty()) {
            throw new IllegalArgumentException("Category must not be null or empty");
        }
        try {
            fest.setCategory(EventCategory.valueOf(request.getCategory()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category value: '" + request.getCategory() + "'. Please use a valid category.");
        }

        return festService.createFest(collegeId, fest);
    }

    @GetMapping("/{collegeId}") // Correct path
    public List<Fest> getFests(@PathVariable Long collegeId) {
        return festService.getFestsByCollegeId(collegeId);
    }
} 