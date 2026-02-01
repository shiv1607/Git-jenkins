package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {

    //Get all programs under a specific fest
    List<Program> findByFestId(Long festId);

    //Search by type (e.g., HACKATHON, WORKSHOP, etc.)
    List<Program> findByType(com.FestOrg.FestOrg.model.ProgramType type);

    //Search by title containing keyword
    List<Program> findByTitleContainingIgnoreCase(String keyword);
    
    List<Program> findAllByFestCollegeId(Long collegeId);
    
    // Get all programs for a specific college (for Excel download) - Using Native SQL
    @Query(value = "SELECT p.* FROM programs p " +
                   "JOIN fests f ON p.fest_id = f.id " +
                   "JOIN colleges c ON f.college_id = c.user_id " +
                   "WHERE c.user_id = :collegeId", nativeQuery = true)
    List<Program> findByFestCollegeId(@Param("collegeId") Long collegeId);
}