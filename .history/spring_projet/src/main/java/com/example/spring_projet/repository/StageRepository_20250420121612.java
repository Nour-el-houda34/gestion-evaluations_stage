package com.example.spring_projet.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Stage;

public interface StageRepository extends JpaRepository<Stage, Long> {
    Optional<Stage> findByDescription(String description);
}
