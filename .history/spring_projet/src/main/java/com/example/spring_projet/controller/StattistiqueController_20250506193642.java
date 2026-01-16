package com.example.spring_projet.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_projet.service.StageService;
import com.example.spring_projet.service.StagiaireService;
import com.example.spring_projet.service.TuteurService;

@RestController
@RequestMapping("/api/statistiques")
public class StattistiqueController {

@Autowired
    private StageService stageService;
    @Autowired
    private StagiaireService stagiaireService;
    @Autowired
    private TuteurService tuteurService;

    @GetMapping("/totalestagiares")
    public long  totalestagiares(){
        return stagiaireService.getTotalStagiaires();
    }

    @GetMapping("/totaletuteurs")
    public long  totaletuteurs(){
        return tuteurService.getTotalTuteurs();
    }

    @GetMapping("/totalestages")
    public long  totalestages(){
        return stageService.getTotalStages();
    }
    
}
