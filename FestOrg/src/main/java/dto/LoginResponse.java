package dto;

import com.FestOrg.FestOrg.model.Role;

public class LoginResponse {
	private String message;
    private Long userId;
    private String username;
    private Role role;
	
	public LoginResponse(String message, Long userId, String username, Role role) {
		super();
		this.message = message;
		this.userId = userId;
		this.username = username;
		this.role = role;
	}
	public LoginResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
    
}
