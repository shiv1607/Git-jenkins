//package com.FestOrg.FestOrg.model;
package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "fests")
public class Fest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "start_date")
    private LocalDate startDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id")
    @JsonIgnoreProperties({"fests", "hibernateLazyInitializer", "handler"})
    private College college;
    
    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status")
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(name = "is_public")
    private boolean isPublic = false; 

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "fest", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"fest", "hibernateLazyInitializer", "handler"})
    private List<Program> programs = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public College getCollege() {
		return college;
	}

	public void setCollege(College college) {
		this.college = college;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public ApprovalStatus getApprovalStatus() {
		return approvalStatus;
	}

	public void setApprovalStatus(ApprovalStatus approvalStatus) {
		this.approvalStatus = approvalStatus;
	}

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public List<Program> getPrograms() {
		return programs;
	}

	public void setPrograms(List<Program> programs) {
		this.programs = programs;
	}
}






//
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import com.fasterxml.jackson.annotation.JsonManagedReference;
//
//@Data
//@Entity
//@Table(name = "fests")
//public class Fest {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String title;
//    
//    @Column(name = "description", columnDefinition = "TEXT")
//    private String description;
//    private LocalDate date;
//
////    @ManyToOne
////    @JoinColumn(name = "college_id")
////    @JsonBackReference
////    private College college;
//    
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "college_id")
//    @JsonIgnoreProperties({"fests", "hibernateLazyInitializer", "handler"})
//    private College college;
//    
//    @Column(name = "image_url")
//    private String imageUrl;
//
//    @Enumerated(EnumType.STRING)
//    @Column(name = "approval_status")
//    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;
//
//    @Column(name = "is_public")
//    private boolean isPublic = false; 
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//    @OneToMany(mappedBy = "fest", cascade = CascadeType.ALL, orphanRemoval = true)
////    @JsonManagedReference
//    @JsonIgnoreProperties({"fest", "hibernateLazyInitializer", "handler"})
//    private List<Program> programs = new ArrayList<>();
//
//	public Long getId() {
//		return id;
//	}
//
//	public void setId(Long id) {
//		this.id = id;
//	}
//
//	public String getTitle() {
//		return title;
//	}
//
//	public void setTitle(String title) {
//		this.title = title;
//	}
//
//	public String getDescription() {
//		return description;
//	}
//
//	public void setDescription(String description) {
//		this.description = description;
//	}
//
//	public LocalDate getDate() {
//		return date;
//	}
//
//	public void setDate(LocalDate date) {
//		this.date = date;
//	}
//
//	public College getCollege() {
//		return college;
//	}
//
//	public void setCollege(College college) {
//		this.college = college;
//	}
//
//	public String getImageUrl() {
//		return imageUrl;
//	}
//
//	public void setImageUrl(String imageUrl) {
//		this.imageUrl = imageUrl;
//	}
//
//	public ApprovalStatus getApprovalStatus() {
//		return approvalStatus;
//	}
//
//	public void setApprovalStatus(ApprovalStatus approvalStatus) {
//		this.approvalStatus = approvalStatus;
//	}
//
//	public boolean isPublic() {
//		return isPublic;
//	}
//
//	public void setPublic(boolean isPublic) {
//		this.isPublic = isPublic;
//	}
//
//	public LocalDateTime getCreatedAt() {
//		return createdAt;
//	}
//
//	public void setCreatedAt(LocalDateTime createdAt) {
//		this.createdAt = createdAt;
//	}
//
//	public List<Program> getPrograms() {
//		return programs;
//	}
//
//	public void setPrograms(List<Program> programs) {
//		this.programs = programs;
//	}
//    
//    
//}
