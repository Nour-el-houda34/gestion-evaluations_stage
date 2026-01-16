package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.spring_projet.models.Appreciation;
import com.example.spring_projet.models.AppreciationId;
import com.example.spring_projet.models.Stagiaire;

public interface AppreciationRepository extends JpaRepository<Appreciation, AppreciationId> {
    List<Appreciation> findByTuteurId(Long tuteurId);


@Query("SELECT DISTINCT s FROM Appreciation a " +
    "JOIN a.periode p " +
    "JOIN p.stagiaire s " )
List<Stagiaire> findStagiaires();

    
   


}