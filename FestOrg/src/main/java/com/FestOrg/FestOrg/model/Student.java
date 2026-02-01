package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "user_id")
public class Student extends User {
	@JsonProperty("collegeName") 
    private String collegeName;
	
	@JsonProperty("course")
    private String course;
    private int year;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProgramBooking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Review> reviews = new ArrayList<>();
    
    

    public Student(Long id, String username, String email, String password, Role role, LocalDateTime createdAt,
                   String collegeName, String course, int year) {
        super(id, username, email, password, role, createdAt);
        this.collegeName = collegeName;
        this.course = course;
        this.year = year;
    }
    
    public Student() {
		super();
	}

    @Override
    public String toString() {
        return "Student{" +
                "collegeName='" + collegeName + '\'' +
                ", course='" + course + '\'' +
                ", year=" + year +
                '}'; 
    }
    
    
}
