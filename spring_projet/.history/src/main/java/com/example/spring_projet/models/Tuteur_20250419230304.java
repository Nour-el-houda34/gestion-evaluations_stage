package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
public class Tuteur extends Personne {

    private String entreprise;

    @OneToMany(mappedBy = "tuteur")
    private List<Appreciation> appreciations = new ArrayList<>();

    // Getters and Setters
    public String getEntreprise() { return entreprise; }
    public void setEntreprise(String entreprise) { this.entreprise = entreprise; }
    public List<Appreciation> getAppreciations() { return appreciations; }
    public void setAppreciations(List<Appreciation> appreciations) { this.appreciations = appreciations; }
}
