package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Appreciation;
import com.example.spring_projet.models.AppreciationId;

public interface AppreciationRepository extends JpaRepository<Appreciation, AppreciationId> {
    List<Appreciation> findByTuteurId(Long tuteurId);
}