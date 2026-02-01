package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.*;
import com.FestOrg.FestOrg.repository.ProgramBookingRepository;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import com.FestOrg.FestOrg.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProgramBookingService {

    @Autowired
    private ProgramBookingRepository programBookingRepository;

    @Autowired
    private ProgramRepository programRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;

    public ProgramBooking createBooking(Long studentId, Long programId, String razorpayPaymentId) {
        // 1. Prevent double booking
        if (programBookingRepository.existsByStudentIdAndProgramId(studentId, programId)) {
            throw new RuntimeException("You have already registered for this program.");
        }

        // 2. Validate user & program
        Optional<User> studentOpt = userRepository.findById(studentId);
        Optional<Program> programOpt = programRepository.findById(programId);

        if (studentOpt.isEmpty() || programOpt.isEmpty()) {
            throw new RuntimeException("Invalid student or program ID.");
        }

        User student = studentOpt.get();
        Program program = programOpt.get();

        // 3. Check program's parent fest is approved and public
        Fest fest = program.getFest();
        if (fest.getApprovalStatus() != ApprovalStatus.APPROVED || !fest.isPublic()) {
            throw new RuntimeException("Program's fest is not available for booking.");
        }

        // 4. Check seat availability
        if (program.getSeatLimit() <= 0) {
            throw new RuntimeException("No seats available in this program.");
        }

        // 5. Create booking with all details
        ProgramBooking booking = new ProgramBooking();
        
        // Set all the direct fields
        booking.setProgramId(programId);
        booking.setStudentId(studentId);
        booking.setStudentEmail(student.getEmail());
        booking.setStudentName(student.getUsername());
        booking.setProgramName(program.getTitle());
        booking.setFestivalName(fest.getTitle());
        booking.setCollegeName(fest.getCollege().getName());
        booking.setProgramType(program.getType().toString());
        booking.setProgramDate(program.getDate().toString());
        booking.setProgramTime(program.getTime());
        booking.setProgramVenue(program.getVenue());
        booking.setTicketPrice(program.getTicketPrice());

        if (program.getTicketPrice() == 0) {
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking.setRazorpayPaymentId(null);
        } else {
            if (razorpayPaymentId == null || razorpayPaymentId.isEmpty()) {
                throw new RuntimeException("Payment required for this program.");
            }
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking.setRazorpayPaymentId(razorpayPaymentId);
        }

        // 6. Reduce available seats
        program.setSeatLimit(program.getSeatLimit() - 1);
        programRepository.save(program);
        
        // 7. Save booking
        ProgramBooking savedBooking = programBookingRepository.save(booking);

        // 8. Send confirmation email
        emailService.sendBookingConfirmation(
            student.getEmail(),
            student.getUsername(),
            program.getTitle(),
            fest.getTitle(),
            fest.getCollege().getName(),
            program.getDate().toString(),
            program.getTime(),
            program.getVenue(),
            program.getTicketPrice(),
            razorpayPaymentId
        );

        return savedBooking;
    }
}