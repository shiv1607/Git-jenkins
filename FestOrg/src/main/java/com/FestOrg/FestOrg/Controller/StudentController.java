package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Student;
import com.FestOrg.FestOrg.service.StudentService;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //Student registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
        try {
            // Encode password before saving
            student.setPassword(passwordEncoder.encode(student.getPassword()));

            // Register student using service
            student.setCreatedAt(LocalDateTime.now());
            Student savedStudent = studentService.registerStudent(student);
            return ResponseEntity.ok(savedStudent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

}
