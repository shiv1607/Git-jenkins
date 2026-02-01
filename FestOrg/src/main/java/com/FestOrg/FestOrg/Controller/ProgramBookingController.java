package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.*;
import com.FestOrg.FestOrg.repository.ProgramBookingRepository;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import com.FestOrg.FestOrg.repository.UserRepository;
import com.FestOrg.FestOrg.repository.GroupMemberRepository;
import com.FestOrg.FestOrg.service.PaymentService;
import com.FestOrg.FestOrg.service.EmailService;
import dto.GroupBookingRequest;
import dto.GroupMemberDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/program-bookings")
public class ProgramBookingController {

    @Autowired
    private ProgramBookingRepository programBookingRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EmailService emailService;

    // ✅ Step 1: Create Razorpay Order (only for paid programs)
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> body) {
        try {
            Long programId = Long.parseLong(body.get("programId"));
            Integer groupSize = Integer.parseInt(body.getOrDefault("groupSize", "1"));

            Optional<Program> programOpt = programRepository.findById(programId);
            if (programOpt.isEmpty()) return ResponseEntity.badRequest().body("Invalid Program ID");

            Program program = programOpt.get();

            if (program.getTicketPrice() == 0) {
                return ResponseEntity.badRequest().body("Free program — no payment required.");
            }

            // Calculate total amount for group
            double totalAmount = program.getTicketPrice();

            String orderId = paymentService.createOrder(
                    (int) totalAmount,  // Razorpay uses amount in paise
                    "receipt_" + programId + "_" + System.currentTimeMillis()
            );

            return ResponseEntity.ok(Map.of("orderId", orderId, "totalAmount", totalAmount));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // ✅ Step 2: Create booking (free or paid) with group support
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody GroupBookingRequest request) {
        try {
            System.out.println("=== RAW REQUEST DEBUG ===");
            System.out.println("Raw request object: " + request);
            System.out.println("Request class: " + request.getClass().getName());
            
            Long studentId = request.getStudentId();
            Long programId = request.getProgramId();
            String razorpayPaymentId = request.getRazorpayPaymentId();
            boolean isGroupBooking = request.isGroupBooking();
            Integer groupSize = request.getGroupSize();
            List<GroupMemberDTO> groupMembers = request.getGroupMembers();
            
            System.out.println("Parsed values:");
            System.out.println("- studentId: " + studentId);
            System.out.println("- programId: " + programId);
            System.out.println("- isGroupBooking: " + isGroupBooking);
            System.out.println("- groupSize: " + groupSize);
            System.out.println("- groupMembers: " + groupMembers);
            System.out.println("=== END RAW REQUEST DEBUG ===");
            
            System.out.println("=== REQUEST DEBUG ===");
            System.out.println("Received request - studentId: " + studentId + ", programId: " + programId);
            System.out.println("isGroupBooking: " + isGroupBooking);
            System.out.println("groupSize: " + groupSize);
            System.out.println("groupMembers count: " + (groupMembers != null ? groupMembers.size() : "NULL"));
            if (groupMembers != null) {
                for (int i = 0; i < groupMembers.size(); i++) {
                    GroupMemberDTO member = groupMembers.get(i);
                    System.out.println("Member " + i + ": " + member.getMemberName() + " (" + member.getMemberEmail() + ")");
                }
            }
            System.out.println("=== END REQUEST DEBUG ===");

            // Validate group size (1-4 members)
            if (isGroupBooking) {
                if (groupSize == null || groupSize < 1 || groupSize > 4) {
                    return ResponseEntity.badRequest().body("Group size must be between 1 and 4 members.");
                }
                
                if (groupMembers == null || groupMembers.size() != groupSize) {
                    return ResponseEntity.badRequest().body("Number of group members must match group size.");
                }
            } else {
                groupSize = 1;
                groupMembers = new ArrayList<>();
            }

            // Fetch student (User)
            User student = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Fetch program
            Program program = programRepository.findById(programId)
                    .orElseThrow(() -> new RuntimeException("Program not found"));

            // Check availability based on booking type
            if (program.getBookingType() != null && program.getBookingType().equals("group")) {
                // For group bookings, check against numberOfTeams
                long currentTeams = program.getBookings().size();
                if (currentTeams >= (program.getNumberOfTeams() != null ? program.getNumberOfTeams() : 0)) {
                    return ResponseEntity.badRequest().body("No more teams can register for this event.");
                }
            } else {
                // For solo bookings, check against seatLimit
                if (program.getBookings().size() + groupSize > program.getSeatLimit()) {
                    return ResponseEntity.badRequest().body("Not enough seats available for booking.");
                }
            }

            // Prevent duplicate booking
            boolean alreadyBooked = programBookingRepository.existsByStudentIdAndProgramId(studentId, programId);
            if (alreadyBooked) {
                return ResponseEntity.badRequest().body("You already booked this program.");
            }

            // Create and save booking with all details
            ProgramBooking booking = new ProgramBooking();
            
            // Set all the direct fields
            booking.setProgramId(programId);
            booking.setStudentId(studentId);
            booking.setStudentEmail(student.getEmail());
            booking.setStudentName(student.getUsername());
            booking.setProgramName(program.getTitle());
            booking.setFestivalName(program.getFest().getTitle());
            booking.setCollegeName(program.getFest().getCollege().getName());
            booking.setProgramType(program.getType().toString());
            booking.setProgramDate(program.getDate().toString());
            booking.setProgramTime(program.getTime());
            booking.setProgramVenue(program.getVenue());
            booking.setTicketPrice(program.getTicketPrice());

            // Set group booking fields
            booking.setGroupBooking(isGroupBooking);
            booking.setGroupSize(groupSize);
            booking.setTotalAmount(program.getTicketPrice());

            if (program.getTicketPrice() == 0) {
                booking.setPaymentStatus(PaymentStatus.PAID);
            } else {
                if (razorpayPaymentId == null || razorpayPaymentId.isBlank()) {
                    return ResponseEntity.badRequest().body("Payment ID required for paid programs.");
                }
                booking.setPaymentStatus(PaymentStatus.PAID);
                booking.setRazorpayPaymentId(razorpayPaymentId);
            }

            // Save the booking first
            ProgramBooking savedBooking = programBookingRepository.save(booking);

            // Add group members if it's a group booking
            System.out.println("=== GROUP BOOKING DEBUG ===");
            System.out.println("isGroupBooking: " + isGroupBooking);
            System.out.println("groupMembers: " + (groupMembers != null ? groupMembers.size() : "NULL"));
            System.out.println("groupSize: " + groupSize);
            
            if (isGroupBooking && groupMembers != null) {
                System.out.println("Saving group members. Count: " + groupMembers.size());
                List<GroupMember> members = new ArrayList<>();
                for (GroupMemberDTO memberDTO : groupMembers) {
                    System.out.println("Processing member: " + memberDTO.getMemberName());
                    GroupMember member = new GroupMember();
                    member.setBooking(savedBooking);
                    member.setMemberName(memberDTO.getMemberName());
                    member.setMemberEmail(memberDTO.getMemberEmail());
                    member.setMemberPhone(memberDTO.getMemberPhone());
                    members.add(member);
                }
                try {
                    List<GroupMember> savedMembers = groupMemberRepository.saveAll(members);
                    System.out.println("Successfully saved " + savedMembers.size() + " group members");
                } catch (Exception e) {
                    System.err.println("Error saving group members: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.out.println("NOT saving group members because:");
                System.out.println("- isGroupBooking: " + isGroupBooking);
                System.out.println("- groupMembers null: " + (groupMembers == null));
            }
            System.out.println("=== END DEBUG ===");
            
            // Send confirmation email
            try {
                if (isGroupBooking && groupMembers != null) {
                    // Send group booking confirmation email
                    List<String> groupMemberNames = new ArrayList<>();
                    for (GroupMemberDTO member : groupMembers) {
                        groupMemberNames.add(member.getMemberName());
                    }
                    
                    emailService.sendGroupBookingConfirmation(
                        student.getEmail(),
                        student.getUsername(),
                        program.getTitle(),
                        program.getFest().getTitle(),
                        program.getFest().getCollege().getName(),
                        program.getDate().toString(),
                        program.getTime(),
                        program.getVenue(),
                        program.getTicketPrice(),
                        groupSize,
                        groupMemberNames,
                        razorpayPaymentId  // Add transaction ID
                    );
                    System.out.println("✅ Group booking confirmation email sent to: " + student.getEmail());
                } else {
                    // Send solo booking confirmation email
                    emailService.sendBookingConfirmation(
                        student.getEmail(),
                        student.getUsername(),
                        program.getTitle(),
                        program.getFest().getTitle(),
                        program.getFest().getCollege().getName(),
                        program.getDate().toString(),
                        program.getTime(),
                        program.getVenue(),
                        program.getTicketPrice(),
                        razorpayPaymentId  // Add transaction ID
                    );
                    System.out.println("✅ Solo booking confirmation email sent to: " + student.getEmail());
                }
            } catch (Exception e) {
                System.err.println("❌ Error sending confirmation email: " + e.getMessage());
                e.printStackTrace();
                // Don't fail the booking if email fails
            }
            
            return ResponseEntity.ok(savedBooking);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error: " + e.getMessage());
        }
    }

    // Get all bookings by student (simplified - no joins needed)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getBookingsByStudent(@PathVariable Long studentId) {
        List<ProgramBooking> bookings = programBookingRepository.findByStudentId(studentId);
        return ResponseEntity.ok(bookings);
    }

    // Get all bookings by program
    @GetMapping("/program/{programId}")
    public ResponseEntity<?> getBookingsByProgram(@PathVariable Long programId) {
        List<ProgramBooking> bookings = programBookingRepository.findByProgramId(programId);
        return ResponseEntity.ok(bookings);
    }

    // Get group members for a specific booking
    @GetMapping("/booking/{bookingId}/group-members")
    public ResponseEntity<?> getGroupMembersByBooking(@PathVariable Long bookingId) {
        List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(bookingId);
        return ResponseEntity.ok(groupMembers);
    }
}