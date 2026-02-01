package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.ProgramBooking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProgramBookingRepository extends JpaRepository<ProgramBooking, Long> {

    List<ProgramBooking> findByStudentId(Long studentId);

    List<ProgramBooking> findByProgramId(Long programId);

    boolean existsByStudentIdAndProgramId(Long studentId, Long programId);

    // New query to get bookings with all details (no joins needed)
    @Query("SELECT b FROM ProgramBooking b WHERE b.studentId = :studentId ORDER BY b.bookingDate DESC")
    List<ProgramBooking> findByStudentIdWithDetails(@Param("studentId") Long studentId);
} 