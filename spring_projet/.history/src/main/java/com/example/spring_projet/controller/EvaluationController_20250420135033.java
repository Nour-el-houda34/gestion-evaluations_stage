package com.example.spring_projet.controller;

import com.example.spring_projet.dto.*;
import com.example.spring_projet.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    private final StagiaireService stagiaireService;
    private final StageService stageService;
    private final TuteurService tuteurService;
    private final PeriodeService periodeService;
    private final AppreciationService appreciationService;

    public EvaluationController(StagiaireService stagiaireService,
                                StageService stageService,
                                TuteurService tuteurService,
                                PeriodeService periodeService,
                                AppreciationService appreciationService) {
        this.stagiaireService = stagiaireService;
        this.stageService = stageService;
        this.tuteurService = tuteurService;
        this.periodeService = periodeService;
        this.appreciationService = appreciationService;
    }

    // Endpoint pour soumettre toutes les informations d'évaluation, stagiaire, tuteur, etc.
    @PostMapping("/submit")
    public ResponseEntity<String> submitEvaluation(
            @RequestBody FormDataDTO formDataDTO) {
        try {
            // Save Stagiaire
            stagiaireService.save(formDataDTO.getStagiaire());
            
            // Save Stage
            stageService.save(formDataDTO.getStage());
            
            // Save Tuteur
            tuteurService.save(formDataDTO.getTuteur());
            
            // Save Periode
            periodeService.save(formDataDTO);
    
            // Save Appreciation and related Evaluations
            appreciationService.saveAppreciation(formDataDTO.getAppreciation());
    
            return new ResponseEntity<>("Form submitted successfully!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error submitting form", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

}
