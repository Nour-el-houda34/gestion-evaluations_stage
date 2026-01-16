package com.example.spring_projet.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.spring_projet.controller.EvaluationController;
import com.example.spring_projet.dto.AppreciationDTO;
import com.example.spring_projet.dto.CategorieDTO;
import com.example.spring_projet.dto.CompetenceDTO;
import com.example.spring_projet.dto.EvaluationDTO;
import com.example.spring_projet.models.Appreciation;
import com.example.spring_projet.models.Categorie;
import com.example.spring_projet.models.Competence;
import com.example.spring_projet.models.Evaluation;
import com.example.spring_projet.repository.AppreciationRepository;
import com.example.spring_projet.repository.CategorieRepository;
import com.example.spring_projet.repository.CompetenceRepository;
import com.example.spring_projet.repository.EvaluationRepository;

@Service
public class AppreciationService {

    private final AppreciationRepository appreciationRepository;
    private final EvaluationRepository evaluationRepository;
    private final CompetenceRepository competenceRepository;
    private final CategorieRepository categorieRepository;
    private final ModelMapper modelMapper;

    private static final Logger logger = LoggerFactory.getLogger(EvaluationController.class);

    public AppreciationService(AppreciationRepository appreciationRepository,
                               EvaluationRepository evaluationRepository,
                               CompetenceRepository competenceRepository,
                               CategorieRepository categorieRepository,
                               ModelMapper modelMapper) {
        this.appreciationRepository = appreciationRepository;
        this.evaluationRepository = evaluationRepository;
        this.competenceRepository = competenceRepository;
        this.categorieRepository = categorieRepository;
        this.modelMapper = modelMapper;
    }

    public AppreciationDTO saveAppreciation(AppreciationDTO appreciationDTO) {
        logger.info("Saving Appreciation: " + appreciationDTO);
    
        // Sauvegarder l'appréciation sans les évaluations et compétences
        Appreciation appreciation = modelMapper.map(appreciationDTO, Appreciation.class);
        appreciation = appreciationRepository.save(appreciation);
    
        // Gérer les évaluations (si nécessaire)
        List<Evaluation> evaluations = new ArrayList<>();
        for (EvaluationDTO evalDTO : appreciationDTO.getEvaluations()) {
            Evaluation evaluation = modelMapper.map(evalDTO, Evaluation.class);
            evaluation.setAppreciation(appreciation);
            evaluations.add(evaluationRepository.save(evaluation));
        }
        appreciation.setEvaluations(evaluations);
    
        // Sauvegarde des compétences et des catégories
List<Competence> competences = new ArrayList<>();
for (CompetenceDTO compDTO : appreciationDTO.getCompetences()) {
    Competence competence = new Competence();
    competence.setIntitule(compDTO.getIntitule());
    competence.setNote(compDTO.getNote());
    competence.setAppreciation(appreciation);

    List<Categorie> categories = new ArrayList<>();
    for (CategorieDTO catDTO : compDTO.getCategories()) {
        Categorie categorie = new Categorie();
        categorie.setIntitule(catDTO.getIntitule());
        categorie.setValeur(catDTO.getValeur());
        categorie.setCompetence(competence); // 🔴 Lien obligatoire
        categories.add(categorie);
    }

    competence.setCategories(categories);
    appreciation.getCompetences().add(competence);
}

// Lier les compétences à l'appréciation
appreciation.setCompetences(competences);
appreciation = appreciationRepository.save(appreciation);

    
        return modelMapper.map(appreciation, AppreciationDTO.class);
    }
}
