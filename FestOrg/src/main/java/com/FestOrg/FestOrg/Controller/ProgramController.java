package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.model.Program;
import com.FestOrg.FestOrg.repository.ProgramRepository;
import com.FestOrg.FestOrg.service.FestService;
import com.FestOrg.FestOrg.service.ProgramService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/programs")
public class ProgramController {

    private final ProgramService programService;
    private final FestService festService;
    
    @Autowired
    private ProgramRepository programRepository;

    public ProgramController(ProgramService programService, FestService festService) {
        this.programService = programService;
        this.festService = festService;
    }

    @PostMapping("/create/{festId}")
    public ResponseEntity<?> createProgramInFest(@PathVariable Long festId, @RequestBody Program program) {
        Fest fest = festService.getFestById(festId);
        if (fest == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Fest not found"));
        }
        if (program.getTitle() == null || program.getTitle().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Title is required"));
        }
        program.setFest(fest);
        Program savedProgram = programService.saveProgram(program);
        return ResponseEntity.ok(savedProgram);
    }

    //Get all programs of a fest
    @GetMapping("/fest/{festId}")
    public ResponseEntity<List<Program>> getProgramsByFest(@PathVariable Long festId) {
        return ResponseEntity.ok(programService.getProgramsByFestId(festId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getProgramById(@PathVariable Long id) {
        Optional<Program> programOpt = programRepository.findById(id);
        if (programOpt.isPresent()) {
            return ResponseEntity.ok(programOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
