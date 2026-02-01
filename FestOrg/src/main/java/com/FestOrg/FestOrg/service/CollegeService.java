package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.College;
import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.Program;
import com.FestOrg.FestOrg.repository.CollegeRepository;
import com.FestOrg.FestOrg.repository.FestRepository;
import com.FestOrg.FestOrg.repository.ProgramRepository;

//import dto.CollegeDTO;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CollegeService {

    private final FestRepository festRepository;
    private final ProgramRepository programRepository;

    @Autowired
    public CollegeService(
        CollegeRepository collegeRepository,
        FestRepository festRepository,
        ProgramRepository programRepository
    ) {
        this.collegeRepository = collegeRepository;
        this.festRepository = festRepository;
        this.programRepository = programRepository;
    }

    // Create new college
    public College createCollege(College college) {
        return collegeRepository.save(college);
    }
    
    
    @Autowired
    private CollegeRepository collegeRepository;


    // Delete a fest belonging to a college
    @Transactional
    public String deleteFestByCollege(Long festId, Long collegeId) {
        Optional<Fest> fest = festRepository.findByIdAndCollegeId(festId, collegeId);

        if (fest.isPresent()) {
            festRepository.deleteByIdAndCollegeId(festId, collegeId);
            return "Fest deleted successfully.";
        } else {
            throw new RuntimeException("Fest not found or not authorized");
        }
    }

    //Add a program to a fest by the college
    @Transactional
    public Program addProgramToFest(Long collegeId, Long festId, Program program) {
        Optional<Fest> festOpt = festRepository.findByIdAndCollegeId(festId, collegeId);

        if (festOpt.isEmpty()) {
            throw new RuntimeException("Fest not found or not authorized");
        }

        program.setFest(festOpt.get());
        return programRepository.save(program);
    }

    //Delete a program from a fest
    @Transactional
    public String deleteProgram(Long programId, Long collegeId) {
        Optional<Program> programOpt = programRepository.findById(programId);

        if (programOpt.isPresent()) {
            Fest fest = programOpt.get().getFest();
            if (fest.getCollege().getId().equals(collegeId)) {
                programRepository.deleteById(programId);
                return "Program deleted successfully.";
            }
        }
        throw new RuntimeException("Program not found or not authorized");
    }

    //Get all programs from all fests of this college
    
    public List<Program> getAllProgramsByCollege(Long collegeId) {
        return programRepository.findAllByFestCollegeId(collegeId);
    }
}
