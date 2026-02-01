package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramRepository extends JpaRepository<Program, Long> {
    // Basic CRUD operations are inherited from JpaRepository
    // count() method is available for dashboard statistics
} 