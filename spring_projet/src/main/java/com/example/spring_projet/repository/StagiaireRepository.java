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
   
}