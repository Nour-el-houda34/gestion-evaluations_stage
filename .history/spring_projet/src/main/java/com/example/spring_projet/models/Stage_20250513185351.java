package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String objectif;
    private String entreprise;

    @OneToMany(mappedBy = "stage")
    @JsonBackReference
    private List<Periode> periodes = new ArrayList<>();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getObjectif() { return objectif; }
    public void setObjectif(String objectif) { this.objectif = objectif; }
    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }
    public List<Periode> getPeriodes() { return periodes; }
    public void setPeriodes(List<Periode> periodes) { this.periodes = periodes; }
}