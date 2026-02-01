package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    
    // Get all programs for a specific college (for Excel download)
    @Query("SELECT p FROM Program p JOIN p.fest f WHERE f.college.user_id = :collegeId")
    List<Program> findByFestCollegeId(@Param("collegeId") Long collegeId);
    
    //Get all programs under a specific fest
    List<Program> findByFestId(Long festId);

    //Search by type (e.g., HACKATHON, WORKSHOP, etc.)
    List<Program> findByType(com.FestOrg.FestOrg.model.ProgramType type);

    //Search by title containing keyword
    List<Program> findByTitleContainingIgnoreCase(String keyword);
} 