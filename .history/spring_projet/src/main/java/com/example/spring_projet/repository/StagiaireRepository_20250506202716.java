package com.example.spring_projet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Stagiaire;

public interface StagiaireRepository  extends JpaRepository<Stagiaire, Long> {
    Optional<Stagiaire> findByEmail(String email);
}