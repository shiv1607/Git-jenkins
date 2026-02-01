package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.ProgramBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgramBookingRepository extends JpaRepository<ProgramBooking, Long> {
    // Basic CRUD operations are inherited from JpaRepository
    // findAll() method is available for dashboard statistics
} 