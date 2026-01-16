package com.example.spring_projet.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Periode;
import com.example.spring_projet.models.PeriodeId;

public interface  PeriodeRepository extends JpaRepository<Periode, PeriodeId> {
    List<Periode> findByStagiaireId(Long stagiaireId);
}