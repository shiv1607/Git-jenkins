package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.Fest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FestRepository extends JpaRepository<Fest, Long> {
    
    // Find fests by approval status
    List<Fest> findByApprovalStatus(String approvalStatus);
    
    // Count fests by approval status
    long countByApprovalStatus(String approvalStatus);
    
    // Count distinct colleges with approved fests
    @Query("SELECT COUNT(DISTINCT f.college.id) FROM Fest f WHERE f.approvalStatus = :status")
    long countDistinctCollegeByApprovalStatus(@Param("status") String status);
    
    // Find fests with college data (for admin dashboard)
    @Query("SELECT f FROM Fest f JOIN FETCH f.college WHERE f.approvalStatus = :status")
    List<Fest> findByApprovalStatusWithCollege(@Param("status") String status);
} 