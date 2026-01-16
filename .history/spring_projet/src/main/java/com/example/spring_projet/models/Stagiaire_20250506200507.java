package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Stagiaire extends Personne {

    private String email;

    @OneToMany(mappedBy = "stagiaire")
    private List<Periode> periodes = new ArrayList<>();

    // Getters and Setters
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public List<Periode> getPeriodes() { return periodes; }
    public void setPeriodes(List<Periode> periodes) { this.periodes = periodes; }
}