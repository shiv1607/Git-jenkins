package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

//@Data
@Entity
@Table(name = "group_members")
public class GroupMember {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private ProgramBooking booking;
    
    @Column(name = "member_name", nullable = false)
    private String memberName;
    
    @Column(name = "member_email", nullable = false)
    private String memberEmail;
    
    @Column(name = "member_phone", nullable = false)
    private String memberPhone;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public GroupMember() {
        this.createdAt = LocalDateTime.now();
    }
    
    // Constructor with fields
    public GroupMember(ProgramBooking booking, String memberName, String memberEmail, String memberPhone) {
        this.booking = booking;
        this.memberName = memberName;
        this.memberEmail = memberEmail;
        this.memberPhone = memberPhone;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public ProgramBooking getBooking() {
        return booking;
    }
    
    public void setBooking(ProgramBooking booking) {
        this.booking = booking;
    }
    
    public String getMemberName() {
        return memberName;
    }
    
    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }
    
    public String getMemberEmail() {
        return memberEmail;
    }
    
    public void setMemberEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }
    
    public String getMemberPhone() {
        return memberPhone;
    }
    
    public void setMemberPhone(String memberPhone) {
        this.memberPhone = memberPhone;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}