package com.example.spring_projet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.spring_projet.models.Appreciation;
import com.example.spring_projet.models.Stagiaire;

public interface StagiaireRepository  extends JpaRepository<Stagiaire, Long> {
    Optional<Stagiaire> findByEmail(String email);
    @Query("""
    SELECT DISTINCT a FROM Appreciation a
    JOIN FETCH a.tuteur t
    JOIN FETCH a.periode p
    JOIN FETCH p.stagiaire s
    JOIN FETCH p.stage st
    LEFT JOIN FETCH a.evaluations e
    LEFT JOIN FETCH a.competences c
    LEFT JOIN FETCH c.categories cat
    WHERE t.id = :tuteurId
    """)
List<Appreciation> findDetailedAppreciationsByTuteurId(@Param("tuteurId") Long tuteurId);

}