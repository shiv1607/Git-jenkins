package com.FestOrg.FestOrg.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@AllArgsConstructor
@Entity
@Table(name = "colleges")
@PrimaryKeyJoinColumn(name = "user_id")
public class College extends User {
	private String name;
    private String address;
    private String contactNumber;
    private boolean approved = false;

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonManagedReference
    private List<Fest> fests = new ArrayList<>();
    
    
//	public College(Long id, String username, String email, String password, Role role, LocalDateTime createdAt) {
//		super(id, username, email, password, role, createdAt);
//		// TODO Auto-generated constructor stub
//	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public List<Fest> getFests() {
		return fests;
	}

	public void setFests(List<Fest> fests) {
		this.fests = fests;
	}

	public College() {
		super();
	}

	public College(Long id, String username, String email, String password, Role role, LocalDateTime createdAt,
                   String name, String address, String contactNumber, boolean approved) {
        super(id, username, email, password, role, createdAt);
        this.name = name;
        this.address = address;
        this.contactNumber = contactNumber;
        this.approved = approved;
    }

    @Override
    public String toString() {
        return "College{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                '}';
    }
}
