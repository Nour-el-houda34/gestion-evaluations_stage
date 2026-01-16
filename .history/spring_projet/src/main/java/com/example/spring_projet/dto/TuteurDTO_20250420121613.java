package com.example.spring_projet.dto;

public class TuteurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String entreprise;

    public TuteurDTO() {
    }

    public TuteurDTO(Long id, String nom, String prenom, String entreprise) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.entreprise = entreprise;
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

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }
}
