package com.FestOrg.FestOrg.service;

import com.FestOrg.FestOrg.model.Program;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;

    public ProgramService(ProgramRepository programRepository) {
        this.programRepository = programRepository;
    }

    public Program saveProgram(Program program) {
        return programRepository.save(program);
    }

    public List<Program> getProgramsByFestId(Long festId) {
        return programRepository.findByFestId(festId);
    }

    public List<Program> getProgramsByCollegeId(Long collegeId) {
        return programRepository.findAllByFestCollegeId(collegeId);
    }
}
