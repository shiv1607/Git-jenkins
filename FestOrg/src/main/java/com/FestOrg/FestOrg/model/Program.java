package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private ProgramType type;  // Example: HACKATHON, WORKSHOP

    private LocalDate date;
    private String time;
    private String venue;

    @Column(name = "seat_limit", nullable = false)
    private int seatLimit;

    @Column(name = "ticket_price", nullable = false)
    private double ticketPrice;

    // Group booking fields
    @Column(name = "booking_type")
    private String bookingType = "solo"; // "solo" or "group"
    
    @Column(name = "number_of_teams")
    private Integer numberOfTeams;
    
    @Column(name = "max_group_members")
    private Integer maxGroupMembers;

    @ManyToOne
    @JoinColumn(name = "fest_id")
//    @JsonBackReference
    @JsonIgnoreProperties({"programs", "hibernateLazyInitializer", "handler"})
    private Fest fest;
    
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "fest_id")
//    @JsonIgnoreProperties({"programs", "hibernateLazyInitializer", "handler"})
//    private Fest fest;

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ProgramBooking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    
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


	public ProgramType getType() {
		return type;
	}


	public void setType(ProgramType type) {
		this.type = type;
	}


	public LocalDate getDate() {
		return date;
	}


	public void setDate(LocalDate date) {
		this.date = date;
	}


	public String getTime() {
		return time;
	}


	public void setTime(String time) {
		this.time = time;
	}


	public String getVenue() {
		return venue;
	}


	public void setVenue(String venue) {
		this.venue = venue;
	}


	public int getSeatLimit() {
		return seatLimit;
	}


	public void setSeatLimit(int seatLimit) {
		this.seatLimit = seatLimit;
	}


	public double getTicketPrice() {
		return ticketPrice;
	}


	public void setTicketPrice(double ticketPrice) {
		this.ticketPrice = ticketPrice;
	}

    // Group booking getters and setters
    public String getBookingType() {
        return bookingType;
    }

    public void setBookingType(String bookingType) {
        this.bookingType = bookingType;
    }

    public Integer getNumberOfTeams() {
        return numberOfTeams;
    }

    public void setNumberOfTeams(Integer numberOfTeams) {
        this.numberOfTeams = numberOfTeams;
    }

    public Integer getMaxGroupMembers() {
        return maxGroupMembers;
    }

    public void setMaxGroupMembers(Integer maxGroupMembers) {
        this.maxGroupMembers = maxGroupMembers;
    }


	public Fest getFest() {
		return fest;
	}


	public void setFest(Fest fest) {
		this.fest = fest;
	}


	public List<ProgramBooking> getBookings() {
		return bookings;
	}


	public void setBookings(List<ProgramBooking> bookings) {
		this.bookings = bookings;
	}


	public List<Review> getReviews() {
		return reviews;
	}


	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}


	public boolean isSeatAvailable() {
        return bookings.size() < seatLimit;
    }
}