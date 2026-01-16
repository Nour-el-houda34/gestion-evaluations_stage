package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.spring_projet.models.Appreciation;
import com.example.spring_projet.models.AppreciationId;

public interface AppreciationRepository extends JpaRepository<Appreciation, AppreciationId> {
    List<Appreciation> findByTuteurId(Long tuteurId);


    @Query("SELECT a FROM Appreciation a JOIN a.competences c JOIN a.evaluations e join tuteur t join periode p  join stagiare s join stage st")
List<Appreciation> findDetailedAppreciations();
   


}