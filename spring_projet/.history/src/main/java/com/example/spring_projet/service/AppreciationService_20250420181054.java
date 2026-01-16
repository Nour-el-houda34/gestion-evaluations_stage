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
    
        // Étape 1 : Ne pas mapper les évaluations tout de suite
        List<EvaluationDTO> evaluationDTOs = new ArrayList<>(appreciationDTO.getEvaluations());
        appreciationDTO.setEvaluations(new ArrayList<>()); // Temporairement vide
    
        // Mapper le DTO vers l'entité sans les évaluations
        Appreciation appreciation = modelMapper.map(appreciationDTO, Appreciation.class);
    
        // Sauvegarder l'appréciation sans les évaluations
        appreciation = appreciationRepository.save(appreciation);
    
        // Étape 2 : Gérer manuellement les évaluations
        List<Evaluation> evaluations = new ArrayList<>();
        for (EvaluationDTO evalDTO : evaluationDTOs) {
            logger.info("Mapping EvaluationDTO: " + evalDTO);
    
            Evaluation evaluation = modelMapper.map(evalDTO, Evaluation.class);
            evaluation.setAppreciation(appreciation); // Lier manuellement
    
            Evaluation savedEvaluation = evaluationRepository.save(evaluation);
            evaluations.add(savedEvaluation);
            logger.info("Saved Evaluation: " + savedEvaluation);
        }
    
        // Associer les évaluations à l'appréciation
        appreciation.setEvaluations(evaluations);
    
      // Gérer les compétences associées
List<Competence> competences = new ArrayList<>();
for (CompetenceDTO competenceDTO : appreciationDTO.getCompetences()) {
    Competence competence = modelMapper.map(competenceDTO, Competence.class);

    // 🔗 Lier à Appreciation
    competence.setAppreciation(appreciation);

    // Sauvegarder d'abord la compétence
    competence = competenceRepository.save(competence);

    List<Categorie> categories = new ArrayList<>();
    for (CategorieDTO catDTO : competenceDTO.getCategories()) {
        // Toujours créer une nouvelle catégorie et lier à la compétence
        Categorie categorie = new Categorie();
        categorie.setIntitule(catDTO.getIntitule());
        categorie.setValeur(catDTO.getValeur());
        categorie.setCompetence(competence); // ⚠️ Clé étrangère obligatoire

        // Sauvegarder la catégorie
        categorie = categorieRepository.save(categorie);
        categories.add(categorie);
    }

    // Lier les catégories à la compétence
    competence.getCategories().add(categories);


    // Ajouter à la liste des compétences de l'appréciation
    competences.add(competence);
}

// Si tu veux lier les compétences à l'appréciation aussi :
appreciation.setCompetences(competences);

// Mise à jour finale de l'appréciation
appreciation = appreciationRepository.save(appreciation);

       // appreciation.setCompetence(competences);
    
        // Mise à jour finale de l'appréciation avec tout lié correctement
        appreciation = appreciationRepository.save(appreciation);
    
        // Retourner le DTO mis à jour
        return modelMapper.map(appreciation, AppreciationDTO.class);
    }
    


}
