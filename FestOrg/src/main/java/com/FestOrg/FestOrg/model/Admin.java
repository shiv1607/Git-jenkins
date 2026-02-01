package com.FestOrg.FestOrg.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "admins")
@PrimaryKeyJoinColumn(name = "user_id")
public class Admin extends User {

    private String fullName;
    private String contactNumber;
    private String profileImage;
    
    public Admin() {
        super();
    }

    public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}

	public Admin(Long id, String username, String email, String password, Role role, LocalDateTime createdAt,
                 String fullName, String contactNumber, String profileImage) {
        super(id, username, email, password, role, createdAt);
        this.fullName = fullName;
        this.contactNumber = contactNumber;
        this.profileImage = profileImage;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "fullName='" + fullName + '\'' +
                ", contactNumber='" + contactNumber + '\'' +
                ", profileImage='" + profileImage + '\'' +
                '}';
    }

	
}
