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


   @Query("SELECT s FROM Stagiaire s " +
           "JOIN s.periodes p " +
           "JOIN p.id.periodeId pa " +
           "JOIN p.stage st " +
           "JOIN p.appreciations a " +
           "JOIN a.tuteur t " +
           "LEFT JOIN a.evaluations e " +
           "LEFT JOIN a.competences c")
List<Stagiaire> findAllWithAppreciations();

    
   


}