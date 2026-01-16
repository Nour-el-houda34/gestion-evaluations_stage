package com.example.spring_projet.dto;

public class StagiaireDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String institution;

    public StagiaireDTO() {
    }

    public StagiaireDTO(Long id, String nom, String prenom, String institution) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.institution = institution;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }
}

