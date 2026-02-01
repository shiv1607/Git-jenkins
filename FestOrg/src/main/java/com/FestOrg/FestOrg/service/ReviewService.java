package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.Review;
import com.FestOrg.FestOrg.repository.ReviewRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }
    
    public List<Review> getReviewsByProgramId(Long programId) {
        return reviewRepository.findByProgramId(programId);
    }

}