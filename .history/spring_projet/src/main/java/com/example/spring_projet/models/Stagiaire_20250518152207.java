package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

@Entity
@DiscriminatorValue("STAGIAIRE")
public class Stagiaire extends Personne {
    private String institution;

    @OneToMany(mappedBy = "stagiaire")
    @JsonManagedReference
    private List<Periode> periodes = new ArrayList<>();

    // Getters and Setters
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public List<Periode> getPeriodes() { return periodes; }
    public void setPeriodes(List<Periode> periodes) { this.periodes = periodes; }
}