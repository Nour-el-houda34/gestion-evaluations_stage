package com.example.spring_projet.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Tuteur;

public interface TuteurRepository extends JpaRepository<Tuteur, Long> {
    Optional<Tuteur> findByNomAndPrenom(String nom, String prenom);
}