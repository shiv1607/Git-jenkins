package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.Role;
import com.FestOrg.FestOrg.model.Student;
import com.FestOrg.FestOrg.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student registerStudent(Student student) {
        student.setRole(Role.STUDENT); 
        return studentRepository.save(student);
    }
}
