package com.example.spring_projet.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
    
        // Mapper l'AppreciationDTO vers l'entité Appreciation
        Appreciation appreciation = modelMapper.map(appreciationDTO, Appreciation.class);
        
        // Enregistrer l'Appreciation (sans les évaluations/compétences pour l'instant)
        appreciation = appreciationRepository.save(appreciation);
    
        // Gérer les évaluations associées
        List<Evaluation> evaluations = new ArrayList<>();
        for (EvaluationDTO evalDTO : appreciationDTO.getEvaluations()) {
            logger.info("Mapping EvaluationDTO: " + evalDTO); // Log the EvaluationDTO
            
            // Mapper le DTO en entité Evaluation
            Evaluation evaluation = modelMapper.map(evalDTO, Evaluation.class);
            
            // Assurez-vous que l'évaluation est correctement liée à l'appréciation
            evaluation.setAppreciation(appreciation); // Lier à l'appréciation
            
            // Vérifier si l'évaluation existe déjà
            Optional<Evaluation> existingEvaluation = evaluationRepository.findByCategorieAndAppreciationTuteurId(
    evaluation.getCategorie(), 
    evaluation.getAppreciation().getTuteur().getId()
);

if (existingEvaluation.isPresent()) {
    // Il existe déjà une évaluation pour cette catégorie et ce tuteur
    logger.info("Évaluation existante trouvée : " + existingEvaluation.get());
} else {
    // Aucune évaluation existante, vous pouvez procéder à l'enregistrement
    Evaluation savedEvaluation = evaluationRepository.save(evaluation);
    logger.info("Nouvelle évaluation enregistrée : " + savedEvaluation);
}

        }
        
    
        appreciation.setEvaluations(evaluations); // Lier les évaluations à l'appréciation
    
        // Gérer les compétences associées
        List<Competence> competences = new ArrayList<>();
        for (CompetenceDTO competenceDTO : appreciationDTO.getCompetences()) {
            Competence competence = modelMapper.map(competenceDTO, Competence.class);
            
            competence = competenceRepository.save(competence);
            
            List<Categorie> categories = new ArrayList<>();
            for (CategorieDTO catDTO : competenceDTO.getCategories()) {
                // Recherche de la catégorie via l'ID
                Categorie categorie = categorieRepository.findById(catDTO.getId())
                    .orElseGet(() -> {
                        Categorie newCategorie = new Categorie();
                        newCategorie.setIntitule(catDTO.getIntitule());
                        newCategorie.setValeur(catDTO.getValeur());
                        return newCategorie;
                    });
        
                // Lier la catégorie à la compétence
                categorie.setCompetence(competence);
                
                // Sauvegarder la catégorie
                categories.add(categorieRepository.save(categorie));
            }
        
            // Lier les catégories à la compétence
            competence.setCategories(categories);
            
            competences.add(competence);
        }
    
        // Ajouter les compétences à l'appréciation
        appreciation.setCompetence(competences);
    
        // Sauvegarder et renvoyer l'appréciation avec les évaluations et compétences
        appreciation = appreciationRepository.save(appreciation);
        return modelMapper.map(appreciation, AppreciationDTO.class);
    }
    


}
