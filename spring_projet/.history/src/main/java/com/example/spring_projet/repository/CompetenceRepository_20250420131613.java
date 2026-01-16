package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.AppreciationId;
import com.example.spring_projet.models.Competence;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    List<Competence> findByAppreciationId(AppreciationId id);
}