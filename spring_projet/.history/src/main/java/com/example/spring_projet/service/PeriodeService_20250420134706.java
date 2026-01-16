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
        // Récupérer les entités Stagiaire et Stage à partir des IDs
        Stagiaire stagiaire = stagiaireRepository.findById(dto.getStagiaireId())
                .orElseThrow(() -> new RuntimeException("Stagiaire non trouvé"));
        Stage stage = stageRepository.findById(dto.getStageId())
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

        // Créer l'objet Periode à partir du DTO
        Periode periode = new Periode();
        periode.setStagiaire(stagiaire);
        periode.setStage(stage);
        periode.setDateDebut(dto.getDateDebut());
        periode.setDateFin(dto.getDateFin());

        // Sauvegarder la période
        periode = periodeRepository.save(periode);

        // Mapper l'entité vers le DTO pour le renvoyer
        return modelMapper.map(periode, PeriodeDTO.class);
    }
}
