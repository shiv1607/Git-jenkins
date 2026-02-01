package com.FestOrg.FestOrg.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.FestOrg.FestOrg.model.College;

public interface CollegeRepository extends JpaRepository<College, Long> {
    
    List<College> findByApproved(boolean approved);

    Optional<College> findByUsername(String username);
    Optional<College> findByEmail(String email);
    
}
