package com.example.spring_projet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.spring_projet.models.Stage;

public interface StageRepository extends JpaRepository<Stage, Long> {
    Optional<Stage> findByDescription(String description);
    @Query("SELECT s.entreprise AS entreprise, COUNT(s) AS count FROM Stage s GROUP BY s.entreprise")
List<Object[]> countStagesParEntreprise();
}
