package com.example.spring_projet.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {

    List<Categorie> findByCompetenceId(Long competenceId);
    
    Optional<Categorie> findById(Long id);

    Optional<Categorie> findByIntitule(String intitule);
}