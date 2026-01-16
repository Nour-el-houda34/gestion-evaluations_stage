package com.example.spring_projet.controller;

import com.example.spring_projet.dto.*;
import com.example.spring_projet.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/evaluation")
public class EvaluationController {

    private final StagiaireService stagiaireService;
    private final StageService stageService;
    private final TuteurService tuteurService;
    private final PeriodeService periodeService;
    private final AppreciationService appreciationService;

    
private static final Logger logger = LoggerFactory.getLogger(EvaluationController.class);

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
    public ResponseEntity<String> submitEvaluation(@RequestBody FormDataDTO formDataDTO) {
        try {

            logger.info("hiii");

            // 1. Sauvegarde du stagiaire
            StagiaireDTO savedStagiaire = stagiaireService.save(formDataDTO.getStagiaire());
    
            // 2. Sauvegarde du stage
            StageDTO savedStage = stageService.save(formDataDTO.getStage());
    
            // 3. Sauvegarde du tuteur
            tuteurService.save(formDataDTO.getTuteur());
           
    
            // 4. Mise à jour des IDs dans la période
            PeriodeDTO periodeDTO = formDataDTO.getPeriode();
            periodeDTO.setStagiaireId(savedStagiaire.getId());
            periodeDTO.setStageId(savedStage.getId());
    
            // 5. Sauvegarde de la période
            periodeService.save(periodeDTO);
    
            // 6. Mise à jour de l'ID composite dans l'appréciation
            AppreciationDTO appreciationDTO = formDataDTO.getAppreciation();
            PeriodeIdDTO periodeIdDTO = new PeriodeIdDTO();
            periodeIdDTO.setStagiaireId(savedStagiaire.getId());
            periodeIdDTO.setStageId(savedStage.getId());
            appreciationDTO.setPeriodeId(periodeIdDTO);
    
            // 7. Sauvegarde de l'appréciation
            appreciationService.saveAppreciation(appreciationDTO);
    
            return new ResponseEntity<>("Form submitted successfully!", HttpStatus.OK);
    
        } catch (Exception e) {
            e.printStackTrace(); // Pour voir l’erreur dans la console
            return new ResponseEntity<>("Error submitting form: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    


}
