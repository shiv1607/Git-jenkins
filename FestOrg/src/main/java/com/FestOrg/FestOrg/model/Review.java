	package com.FestOrg.FestOrg.model;
	
	import jakarta.persistence.*;
	import lombok.Data;
	
	import java.time.LocalDateTime;
	
	@Data
	@Entity
	@Table(name = "reviews")
	public class Review {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	
	    // Review for a specific program, not fest
	    @ManyToOne
	    @JoinColumn(name = "program_id", nullable = false)
	    private Program program;
	
	    @ManyToOne
	    @JoinColumn(name = "student_id", nullable = false)
	    private User student;
	
	    private int rating;
	    private String comment;
	
	    private LocalDateTime createdAt = LocalDateTime.now();
	
		public Review(Long id, Program program, User student, int rating, String comment, LocalDateTime createdAt) {
			super();
			this.id = id;
			this.program = program;
			this.student = student;
			this.rating = rating;
			this.comment = comment;
			this.createdAt = createdAt;
		}
	
		@Override
		public String toString() {
			return "Review [id=" + id + ", program=" + program + ", student=" + student + ", rating=" + rating
					+ ", comment=" + comment + ", createdAt=" + createdAt + "]";
		}
	    
	    
	}
