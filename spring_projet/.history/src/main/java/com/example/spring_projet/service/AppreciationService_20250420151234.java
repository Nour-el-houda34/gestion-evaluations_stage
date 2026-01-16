package com.example.spring_projet.service;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

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
        // Mapper l'AppreciationDTO vers l'entité Appreciation
        Appreciation appreciation = modelMapper.map(appreciationDTO, Appreciation.class);

        // Enregistrer l'Appreciation (sans les évaluations/compétences pour l'instant)
        appreciation = appreciationRepository.save(appreciation);

        // Gérer les évaluations associées
        List<Evaluation> evaluations = new ArrayList<>();
        for (EvaluationDTO evalDTO : appreciationDTO.getEvaluations()) {
            Evaluation evaluation = modelMapper.map(evalDTO, Evaluation.class);
            evaluation.setAppreciation(appreciation); // Lier à l'appréciation
            evaluations.add(evaluationRepository.save(evaluation));
        }
        appreciation.setEvaluations(evaluations);

        // Gérer les compétences associées
        List<Competence> competences = new ArrayList<>();
        for (CompetenceDTO competenceDTO : appreciationDTO.getCompetences()) {
            Competence competence = modelMapper.map(competenceDTO, Competence.class);
            // Lier les catégories à chaque compétence
            List<Categorie> categories = new ArrayList<>();
            for (CategorieDTO catDTO : competenceDTO.getCategories()) {
                Categorie categorie = categorieRepository.findByIntitule(catDTO.getIntitule())
                    .orElseGet(() -> {
                        Categorie newCategorie = new Categorie();
                        newCategorie.setIntitule(catDTO.getIntitule());
                        newCategorie.setValeur(catDTO.getValeur());
                        return newCategorie; // pas encore save
                    });
            
                categorie.setCompetence(competence); // 🔗 lie la compétence à la catégorie
            
                categories.add(categorieRepository.save(categorie));
            }
            
            
            competence.setCategories(categories);
            competence.setAppreciation(appreciation); // Lier à l'appréciation
            competences.add(competenceRepository.save(competence));
        }
        
        
        appreciation.setCompetence(competences);

        // Sauvegarder et renvoyer l'appréciation avec les évaluations et compétences
        appreciation = appreciationRepository.save(appreciation);
        return modelMapper.map(appreciation, AppreciationDTO.class);
    }
}
