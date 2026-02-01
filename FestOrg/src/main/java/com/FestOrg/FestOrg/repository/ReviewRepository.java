package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findByProgram_Fest_Id(Long festId);
    List<Review> findByProgramId(Long programId);

}	