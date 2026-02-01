package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Review;
import com.FestOrg.FestOrg.service.ReviewService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    //Add new review
    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Review saved = reviewService.addReview(review);
        return ResponseEntity.ok(saved);
    }

    //Get all reviews by program ID
    @GetMapping("/program/{programId}")
    public ResponseEntity<List<Review>> getReviewsByProgram(@PathVariable Long programId) {
        List<Review> reviews = reviewService.getReviewsByProgramId(programId);
        return ResponseEntity.ok(reviews);
    }
}
