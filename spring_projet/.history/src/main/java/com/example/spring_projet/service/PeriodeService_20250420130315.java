package com.example.spring_projet.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.spring_projet.dto.PeriodeDTO;
import com.example.spring_projet.models.Periode;
import com.example.spring_projet.repository.PeriodeRepository;
import com.example.spring_projet.repository.StageRepository;
import com.example.spring_projet.repository.StagiaireRepository;

@Service
public class PeriodeService {
    private final PeriodeRepository periodeRepository;
    private final StagiaireRepository stagiaireRepository;
    private final StageRepository stageRepository;
    private final ModelMapper modelMapper;

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
        // Mapper le DTO vers l'entité
        Periode periode = modelMapper.map(dto, Periode.class);
        
        // Gérer les relations (Stagiaire et Stage)
        periode.setStagiaire(stagiaireRepository.findById(dto.getStagiaireId())
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé")));
        periode.setStage(stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new RuntimeException("Stage non trouvé")));
        
        // Sauvegarder l'entité
        periode = periodeRepository.save(periode);
        
        // Mapper l'entité vers le DTO pour le renvoyer
        return modelMapper.map(periode, PeriodeDTO.class);
    }
}
