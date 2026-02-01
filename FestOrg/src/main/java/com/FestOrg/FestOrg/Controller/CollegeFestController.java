package com.FestOrg.FestOrg.Controller;

import com.FestOrg.FestOrg.model.Fest;
import com.FestOrg.FestOrg.service.FestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/colleges")
public class CollegeFestController {

    @Autowired
    private FestService festService;

    @PostMapping("/{collegeId}/fests")
    public Fest createFest(@PathVariable Long collegeId, @RequestBody Fest fest) {
        return festService.createFest(collegeId, fest);
    }

   
}
