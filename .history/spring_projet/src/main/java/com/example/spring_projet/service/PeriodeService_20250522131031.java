package com.example.spring_projet.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


import com.example.spring_projet.dto.PeriodeDTO;
import com.example.spring_projet.models.Periode;
import com.example.spring_projet.models.PeriodeId;
import com.example.spring_projet.models.Stage;
import com.example.spring_projet.models.Stagiaire;
import com.example.spring_projet.repository.PeriodeRepository;
import com.example.spring_projet.repository.StageRepository;
import com.example.spring_projet.repository.StagiaireRepository;

@Service
public class PeriodeService {
    private final PeriodeRepository periodeRepository;
    private final StagiaireRepository stagiaireRepository;
    private final StageRepository stageRepository;


    public PeriodeService(PeriodeRepository periodeRepository,
                          StagiaireRepository stagiaireRepository,
                          StageRepository stageRepository,
                          ModelMapper modelMapper) {
        this.periodeRepository = periodeRepository;
        this.stagiaireRepository = stagiaireRepository;
        this.stageRepository = stageRepository;
        this.modelMapper = modelMapper;
    }

    public PeriodeDTO save(PeriodeDTO dto) {
        Periode periode = new Periode();

        System.out.println("hiii");
    
 
        if (dto.getStagiaireId() == null || dto.getStageId() == null) {
            throw new RuntimeException("Stagiaire ou Stage non spécifié");
        }
    

        Stagiaire stagiaire = stagiaireRepository.findById(dto.getStagiaireId())
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé"));
        Stage stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));
    

        PeriodeId periodeId = new PeriodeId();
        periodeId.setStagiaireId(dto.getStagiaireId());
        periodeId.setStageId(dto.getStageId());
    
  
        periode.setId(periodeId);
        periode.setStagiaire(stagiaire);
        periode.setStage(stage);
        periode.setDateDebut(dto.getDateDebut());
        periode.setDateFin(dto.getDateFin());
    

        periodeRepository.save(periode);
    
        return dto;
    }
    
}
