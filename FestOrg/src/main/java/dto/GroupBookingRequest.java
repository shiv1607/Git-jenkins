package dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GroupBookingRequest {
    private Long studentId;
    private Long programId;
    private String razorpayPaymentId;
    private boolean isGroupBooking;
    private Integer groupSize;
    private List<GroupMemberDTO> groupMembers;

    public GroupBookingRequest() {}

    public GroupBookingRequest(Long studentId, Long programId, String razorpayPaymentId, 
                             boolean isGroupBooking, Integer groupSize, List<GroupMemberDTO> groupMembers) {
        this.studentId = studentId;
        this.programId = programId;
        this.razorpayPaymentId = razorpayPaymentId;
        this.isGroupBooking = isGroupBooking;
        this.groupSize = groupSize;
        this.groupMembers = groupMembers;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    @JsonProperty("isGroupBooking")
    public boolean isGroupBooking() {
        return isGroupBooking;
    }

    @JsonProperty("isGroupBooking")
    public void setGroupBooking(boolean groupBooking) {
        isGroupBooking = groupBooking;
    }

    public Integer getGroupSize() {
        return groupSize;
    }

    public void setGroupSize(Integer groupSize) {
        this.groupSize = groupSize;
    }

    public List<GroupMemberDTO> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<GroupMemberDTO> groupMembers) {
        this.groupMembers = groupMembers;
    }
}