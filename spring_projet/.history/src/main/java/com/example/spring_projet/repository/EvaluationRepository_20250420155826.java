package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.AppreciationId;
import com.example.spring_projet.models.Evaluation;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByAppreciationId(AppreciationId id);

    
        // Définir une méthode pour vérifier l'existence d'une évaluation avec une catégorie et un tuteur
        Optional<Evaluation> findByCategorieAndAppreciationTuteurId(String categorie, Long tuteurId);
    
}