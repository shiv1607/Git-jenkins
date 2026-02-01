package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "group_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private ProgramBooking booking;
    
    @Column(name = "member_name", nullable = false)
    private String memberName;
    
    @Column(name = "member_email", nullable = false)
    private String memberEmail;
    
    @Column(name = "member_phone")
    private String memberPhone;
} 