package com.example.spring_projet.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

        List<EvaluationDTO> evaluationDTOs = new ArrayList<>(appreciationDTO.getEvaluations());
    appreciationDTO.setEvaluations(new ArrayList<>()); // Temporairement vide

    List<CompetenceDTO> competenceDTOs = new ArrayList<>(appreciationDTO.getCompetences());
    appreciationDTO.setCompetences(new ArrayList<>()); // Temporairement vide
    
    
        // Sauvegarder l'appréciation sans les évaluations et compétences
        Appreciation appreciation = modelMapper.map(appreciationDTO, Appreciation.class);
        appreciation = appreciationRepository.save(appreciation);
    
        // Gérer les évaluations (si nécessaire)
        List<Evaluation> evaluations = new ArrayList<>();
        for (EvaluationDTO evalDTO : evaluationDTOs) {
            Evaluation evaluation = modelMapper.map(evalDTO, Evaluation.class);
            evaluation.setAppreciation(appreciation);
            evaluations.add(evaluationRepository.save(evaluation));
        }
            appreciation.setEvaluations(evaluations);
    
        // Sauvegarde des compétences et des catégories
        List<Competence> competences = new ArrayList<>();
        for (CompetenceDTO compDTO : competenceDTOs) {
            Competence competence = new Competence();
            competence.setIntitule(compDTO.getIntitule());
            competence.setNote(compDTO.getNote());
            competence.setAppreciation(appreciation);
        
            List<Categorie> categories = new ArrayList<>();
            for (CategorieDTO catDTO : compDTO.getCategories()) {
                Categorie categorie = new Categorie();
                categorie.setIntitule(catDTO.getIntitule());
                categorie.setValeur(catDTO.getValeur());
                categorie.setCompetence(competence); // 🔑 lier la compétence AVANT ajout
                categories.add(categorie);
            }
        
            competence.setCategories(categories);
            competences.add(competence);
        }
        
        appreciation.setCompetences(competences);
        appreciation = appreciationRepository.save(appreciation); // Sauvegarde en cascade si configurée


    
        return modelMapper.map(appreciation, AppreciationDTO.class);
    }


     public Map<String, Map<String, Double>> getStatistiques() {
        List<Evaluation> evaluations = evaluationRepository.findAll();

        // Structure : categorie -> (valeur -> count)
        Map<String, Map<String, Long>> counts = evaluations.stream()
            .collect(Collectors.groupingBy(
                Evaluation::getCategorie,
                Collectors.groupingBy(Evaluation::getValeur, Collectors.counting())
            ));

        // Calcul des pourcentages
        Map<String, Map<String, Double>> statistiques = new HashMap<>();

        for (Map.Entry<String, Map<String, Long>> entry : counts.entrySet()) {
            String categorie = entry.getKey();
            Map<String, Long> valeurCounts = entry.getValue();

            long total = valeurCounts.values().stream().mapToLong(Long::longValue).sum();

            Map<String, Double> pourcentages = new HashMap<>();
            for (Map.Entry<String, Long> valeurEntry : valeurCounts.entrySet()) {
                double pourcentage = (valeurEntry.getValue() * 100.0) / total;
                pourcentages.put(valeurEntry.getKey(), Math.round(pourcentage * 10.0) / 10.0); // 1 décimale
            }

            statistiques.put(categorie, pourcentages);
        }

        return statistiques;
    }
}
