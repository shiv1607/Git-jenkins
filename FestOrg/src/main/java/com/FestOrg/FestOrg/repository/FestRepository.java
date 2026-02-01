package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.ApprovalStatus;
import com.FestOrg.FestOrg.model.Fest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FestRepository extends JpaRepository<Fest, Long> {
	@Query("SELECT f FROM Fest f WHERE f.college.id = :collegeId")
    List<Fest> findByCollegeId(@Param("collegeId") Long collegeId);
    
    List<Fest> findByApprovalStatusAndIsPublic(ApprovalStatus status, boolean isPublic);
    
    List<Fest> findByApprovalStatus(ApprovalStatus status);
    List<Fest> findByApprovalStatusAndIsPublicTrue(ApprovalStatus status);
    Optional<Fest> findByIdAndCollegeId(Long festId, Long collegeId);
    void deleteByIdAndCollegeId(Long festId, Long collegeId);
    
    @Query("SELECT f FROM Fest f JOIN FETCH f.college WHERE f.approvalStatus = :status")
    List<Fest> findByApprovalStatusWithCollege(@Param("status") ApprovalStatus status);
}
