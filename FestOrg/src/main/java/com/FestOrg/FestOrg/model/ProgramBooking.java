package com.FestOrg.FestOrg.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "program_bookings")
public class ProgramBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Direct fields for better performance and easier queries
    @Column(name = "program_id")
    private Long programId;
    
    @Column(name = "student_id")
    private Long studentId;
    
    @Column(name = "student_email")
    private String studentEmail;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "program_name")
    private String programName;
    
    @Column(name = "festival_name")
    private String festivalName;
    
    @Column(name = "college_name")
    private String collegeName;
    
    @Column(name = "program_type")
    private String programType;
    
    @Column(name = "program_date")
    private String programDate;
    
    @Column(name = "program_time")
    private String programTime;
    
    @Column(name = "program_venue")
    private String programVenue;
    
    @Column(name = "ticket_price")
    private Double ticketPrice;

    // Group booking fields
    @Column(name = "is_group_booking")
    private Boolean isGroupBooking = false;
    
    @Column(name = "group_size")
    private Integer groupSize = 1;
    
    @Column(name = "total_amount")
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String razorpayPaymentId;

    private LocalDateTime bookingDate = LocalDateTime.now();

    // Group members relationship
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"booking", "hibernateLazyInitializer", "handler"})
    private List<GroupMember> groupMembers = new ArrayList<>();

    // Keep the relationships for backward compatibility
    @ManyToOne
    @JoinColumn(name = "student_id", insertable = false, updatable = false)
    @JsonIgnore
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "program_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"bookings", "hibernateLazyInitializer", "handler"})
    private Program program;

    // Constructors
    public ProgramBooking() {}

    public ProgramBooking(Long programId, Long studentId, String studentEmail, String studentName,
                         String programName, String festivalName, String collegeName, String programType,
                         String programDate, String programTime, String programVenue, Double ticketPrice) {
        this.programId = programId;
        this.studentId = studentId;
        this.studentEmail = studentEmail;
        this.studentName = studentName;
        this.programName = programName;
        this.festivalName = festivalName;
        this.collegeName = collegeName;
        this.programType = programType;
        this.programDate = programDate;
        this.programTime = programTime;
        this.programVenue = programVenue;
        this.ticketPrice = ticketPrice;
    }

    // Getters and Setters for new fields
    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }

    public String getFestivalName() {
        return festivalName;
    }

    public void setFestivalName(String festivalName) {
        this.festivalName = festivalName;
    }

    public String getCollegeName() {
        return collegeName;
    }

    public void setCollegeName(String collegeName) {
        this.collegeName = collegeName;
    }

    public String getProgramType() {
        return programType;
    }

    public void setProgramType(String programType) {
        this.programType = programType;
    }

    public String getProgramDate() {
        return programDate;
    }

    public void setProgramDate(String programDate) {
        this.programDate = programDate;
    }

    public String getProgramTime() {
        return programTime;
    }

    public void setProgramTime(String programTime) {
        this.programTime = programTime;
    }

    public String getProgramVenue() {
        return programVenue;
    }

    public void setProgramVenue(String programVenue) {
        this.programVenue = programVenue;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    // Group booking getters and setters
    public Boolean isGroupBooking() {
        return isGroupBooking;
    }

    public void setGroupBooking(Boolean groupBooking) {
        isGroupBooking = groupBooking;
    }

    public Integer getGroupSize() {
        return groupSize;
    }

    public void setGroupSize(Integer groupSize) {
        this.groupSize = groupSize;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<GroupMember> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<GroupMember> groupMembers) {
        this.groupMembers = groupMembers;
    }

    // Existing getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }
}