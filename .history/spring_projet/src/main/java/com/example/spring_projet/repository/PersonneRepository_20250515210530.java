package com.example.spring_projet.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring_projet.models.Personne;

public interface PersonneRepository  extends JpaRepository<Personne, Long> {

}
