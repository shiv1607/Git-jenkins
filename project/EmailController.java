package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.*;
import com.FestOrg.FestOrg.repository.ProgramBookingRepository;
import com.FestOrg.FestOrg.repository.GroupMemberRepository;
import com.FestOrg.FestOrg.service.EmailService;
import com.FestOrg.FestOrg.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProgramBookingRepository programBookingRepository;

    @Autowired
    private GroupMemberRepository groupMemberRepository;

    @Autowired
    private ExcelService excelService;

    // Send booking confirmation email for a specific booking
    @PostMapping("/send-booking-confirmation/{bookingId}")
    public ResponseEntity<?> sendBookingConfirmation(@PathVariable Long bookingId) {
        try {
            ProgramBooking booking = programBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (booking.isGroupBooking()) {
                // Get group members for this booking
                List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(bookingId);
                List<String> groupMemberNames = groupMembers.stream()
                        .map(GroupMember::getMemberName)
                        .collect(Collectors.toList());

                // Send group booking confirmation
                emailService.sendGroupBookingConfirmation(
                    booking.getStudentEmail(),
                    booking.getStudentName(),
                    booking.getProgramName(),
                    booking.getFestivalName(),
                    booking.getCollegeName(),
                    booking.getProgramDate(),
                    booking.getProgramTime(),
                    booking.getProgramVenue(),
                    booking.getTotalAmount(),
                    booking.getGroupSize(),
                    groupMemberNames,
                    booking.getRazorpayPaymentId()
                );
            } else {
                // Send solo booking confirmation
                emailService.sendBookingConfirmation(
                    booking.getStudentEmail(),
                    booking.getStudentName(),
                    booking.getProgramName(),
                    booking.getFestivalName(),
                    booking.getCollegeName(),
                    booking.getProgramDate(),
                    booking.getProgramTime(),
                    booking.getProgramVenue(),
                    booking.getTicketPrice(),
                    booking.getRazorpayPaymentId()
                );
            }

            return ResponseEntity.ok(Map.of("message", "Booking confirmation email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }

    // Send booking confirmation email for a specific booking with custom email
    @PostMapping("/send-booking-confirmation/{bookingId}/custom-email")
    public ResponseEntity<?> sendBookingConfirmationToCustomEmail(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {
        try {
            String customEmail = request.get("email");
            if (customEmail == null || customEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email address is required");
            }

            ProgramBooking booking = programBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            if (booking.isGroupBooking()) {
                // Get group members for this booking
                List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(bookingId);
                List<String> groupMemberNames = groupMembers.stream()
                        .map(GroupMember::getMemberName)
                        .collect(Collectors.toList());

                // Send group booking confirmation to custom email
                emailService.sendGroupBookingConfirmation(
                    customEmail,
                    booking.getStudentName(),
                    booking.getProgramName(),
                    booking.getFestivalName(),
                    booking.getCollegeName(),
                    booking.getProgramDate(),
                    booking.getProgramTime(),
                    booking.getProgramVenue(),
                    booking.getTotalAmount(),
                    booking.getGroupSize(),
                    groupMemberNames,
                    booking.getRazorpayPaymentId()
                );
            } else {
                // Send solo booking confirmation to custom email
                emailService.sendBookingConfirmation(
                    customEmail,
                    booking.getStudentName(),
                    booking.getProgramName(),
                    booking.getFestivalName(),
                    booking.getCollegeName(),
                    booking.getProgramDate(),
                    booking.getProgramTime(),
                    booking.getProgramVenue(),
                    booking.getTicketPrice(),
                    booking.getRazorpayPaymentId()
                );
            }

            return ResponseEntity.ok(Map.of("message", "Booking confirmation email sent to " + customEmail));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending email: " + e.getMessage());
        }
    }

    // Send booking confirmation emails for all bookings of a program
    @PostMapping("/send-program-confirmations/{programId}")
    public ResponseEntity<?> sendAllBookingConfirmationsForProgram(@PathVariable Long programId) {
        try {
            List<ProgramBooking> bookings = programBookingRepository.findByProgramId(programId);
            int sentCount = 0;
            int errorCount = 0;

            for (ProgramBooking booking : bookings) {
                try {
                    if (booking.isGroupBooking()) {
                        // Get group members for this booking
                        List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(booking.getId());
                        List<String> groupMemberNames = groupMembers.stream()
                                .map(GroupMember::getMemberName)
                                .collect(Collectors.toList());

                        // Send group booking confirmation
                        emailService.sendGroupBookingConfirmation(
                            booking.getStudentEmail(),
                            booking.getStudentName(),
                            booking.getProgramName(),
                            booking.getFestivalName(),
                            booking.getCollegeName(),
                            booking.getProgramDate(),
                            booking.getProgramTime(),
                            booking.getProgramVenue(),
                            booking.getTotalAmount(),
                            booking.getGroupSize(),
                            groupMemberNames,
                            booking.getRazorpayPaymentId()
                        );
                    } else {
                        // Send solo booking confirmation
                        emailService.sendBookingConfirmation(
                            booking.getStudentEmail(),
                            booking.getStudentName(),
                            booking.getProgramName(),
                            booking.getFestivalName(),
                            booking.getCollegeName(),
                            booking.getProgramDate(),
                            booking.getProgramTime(),
                            booking.getProgramVenue(),
                            booking.getTicketPrice(),
                            booking.getRazorpayPaymentId()
                        );
                    }
                    sentCount++;
                } catch (Exception e) {
                    errorCount++;
                    System.err.println("Error sending email for booking " + booking.getId() + ": " + e.getMessage());
                }
            }

            return ResponseEntity.ok(Map.of(
                "message", "Email sending completed",
                "sentCount", sentCount,
                "errorCount", errorCount,
                "totalBookings", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing emails: " + e.getMessage());
        }
    }

    // Send booking confirmation emails for all bookings of a student
    @PostMapping("/send-student-confirmations/{studentId}")
    public ResponseEntity<?> sendAllBookingConfirmationsForStudent(@PathVariable Long studentId) {
        try {
            List<ProgramBooking> bookings = programBookingRepository.findByStudentId(studentId);
            int sentCount = 0;
            int errorCount = 0;

            for (ProgramBooking booking : bookings) {
                try {
                    if (booking.isGroupBooking()) {
                        // Get group members for this booking
                        List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(booking.getId());
                        List<String> groupMemberNames = groupMembers.stream()
                                .map(GroupMember::getMemberName)
                                .collect(Collectors.toList());

                        // Send group booking confirmation
                        emailService.sendGroupBookingConfirmation(
                            booking.getStudentEmail(),
                            booking.getStudentName(),
                            booking.getProgramName(),
                            booking.getFestivalName(),
                            booking.getCollegeName(),
                            booking.getProgramDate(),
                            booking.getProgramTime(),
                            booking.getProgramVenue(),
                            booking.getTotalAmount(),
                            booking.getGroupSize(),
                            groupMemberNames,
                            booking.getRazorpayPaymentId()
                        );
                    } else {
                        // Send solo booking confirmation
                        emailService.sendBookingConfirmation(
                            booking.getStudentEmail(),
                            booking.getStudentName(),
                            booking.getProgramName(),
                            booking.getFestivalName(),
                            booking.getCollegeName(),
                            booking.getProgramDate(),
                            booking.getProgramTime(),
                            booking.getProgramVenue(),
                            booking.getTicketPrice(),
                            booking.getRazorpayPaymentId()
                        );
                    }
                    sentCount++;
                } catch (Exception e) {
                    errorCount++;
                    System.err.println("Error sending email for booking " + booking.getId() + ": " + e.getMessage());
                }
            }

            return ResponseEntity.ok(Map.of(
                "message", "Email sending completed",
                "sentCount", sentCount,
                "errorCount", errorCount,
                "totalBookings", bookings.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing emails: " + e.getMessage());
        }
    }

    // Send Excel report via email for a college
    @PostMapping("/send-excel-report/{collegeId}")
    public ResponseEntity<?> sendExcelReportViaEmail(
            @PathVariable Long collegeId,
            @RequestBody Map<String, String> request) {
        try {
            String emailAddress = request.get("email");
            String collegeName = request.get("collegeName");
            
            if (emailAddress == null || emailAddress.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email address is required");
            }
            
            if (collegeName == null || collegeName.trim().isEmpty()) {
                collegeName = "College " + collegeId;
            }
            
            // Generate Excel report using ExcelService
            byte[] excelData = excelService.generateCollegeBookingsExcel(collegeId);
            
            String fileName = "college_bookings_" + collegeId + "_" + 
                System.currentTimeMillis() + ".xlsx";
            
            // Send email with Excel attachment
            emailService.sendExcelReportWithGroupMembers(emailAddress, collegeName, excelData, fileName);
            
            return ResponseEntity.ok(Map.of(
                "message", "Excel report sent successfully to " + emailAddress,
                "fileName", fileName,
                "fileSize", excelData.length + " bytes"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending Excel report: " + e.getMessage());
        }
    }

    // Send booking reminder email for a specific booking
    @PostMapping("/send-booking-reminder/{bookingId}")
    public ResponseEntity<?> sendBookingReminder(@PathVariable Long bookingId) {
        try {
            ProgramBooking booking = programBookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));

            List<String> groupMemberNames = null;
            if (booking.isGroupBooking()) {
                // Get group members for this booking
                List<GroupMember> groupMembers = groupMemberRepository.findByBookingId(bookingId);
                groupMemberNames = groupMembers.stream()
                        .map(GroupMember::getMemberName)
                        .collect(Collectors.toList());
            }

            // Send booking reminder
            emailService.sendBookingReminder(
                booking.getStudentEmail(),
                booking.getStudentName(),
                booking.getProgramName(),
                booking.getFestivalName(),
                booking.getCollegeName(),
                booking.getProgramDate(),
                booking.getProgramTime(),
                booking.getProgramVenue(),
                booking.isGroupBooking(),
                groupMemberNames,
                booking.getRazorpayPaymentId()
            );

            return ResponseEntity.ok(Map.of("message", "Booking reminder email sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error sending reminder email: " + e.getMessage());
        }
    }

    // Test endpoint to check email service
    @GetMapping("/test")
    public ResponseEntity<?> testEmailService() {
        try {
            return ResponseEntity.ok(Map.of(
                "message", "Email service is working",
                "timestamp", System.currentTimeMillis()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Email service error: " + e.getMessage());
        }
    }
} 