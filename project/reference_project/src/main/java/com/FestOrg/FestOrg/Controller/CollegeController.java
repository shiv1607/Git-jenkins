import com.FestOrg.FestOrg.model.College;
import com.FestOrg.FestOrg.model.EventCategory;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.FestRequest;
import com.FestOrg.FestOrg.model.Role;
import com.FestOrg.FestOrg.service.CollegeService;
import com.FestOrg.FestOrg.service.FestService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/colleges")
public class CollegeController {

    private final CollegeService collegeService;
    private final FestService festService;

    public CollegeController(CollegeService collegeService, FestService festService) {
        this.collegeService = collegeService;
        this.festService = festService;
    }

    @PostMapping
    public ResponseEntity<College> createCollege(@RequestBody College college) {
        college.setRole(Role.COLLEGE);
        College savedCollege = collegeService.createCollege(college);
        return ResponseEntity.ok(savedCollege);
    }
    
    // --- METHODS MOVED FROM CollegeFestController ---

    @PostMapping("/{collegeId}/fests")
    public Fest createFest(@PathVariable Long collegeId, @RequestBody FestRequest request) {
        
        Fest fest = new Fest();
        
        fest.setTitle(request.getTitle());
        fest.setDescription(request.getDescription());
        fest.setStartDate(request.getStartDate());
        fest.setEndDate(request.getEndDate());
        fest.setSeatLimit(request.getSeatLimit());
        fest.setTicketPrice(request.getTicketPrice());
        fest.setImageUrl(request.getImageUrl());
        fest.setSubCategory(request.getSubCategory());
        fest.setTags(request.getTags());

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

    @GetMapping("/{collegeId}/fests")
    public ResponseEntity<List<Fest>> getFestsByCollege(@PathVariable Long collegeId) {
        return ResponseEntity.ok(festService.getFestsByCollege(collegeId));
    }
} 