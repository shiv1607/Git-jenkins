package com.FestOrg.FestOrg.repository;

import com.FestOrg.FestOrg.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    
    List<GroupMember> findByBookingId(Long bookingId);
    
    void deleteByBookingId(Long bookingId);
}