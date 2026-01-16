package com.example.spring_projet.dto;

public class CategorieDTO {

    private Long id;
    private String intitule;
    private CompetenceDTO competence;
    private String valeur; // Ex: "NA", "DEBUTANT", "AUTONOME", "AUTONOME +"


    public CategorieDTO() {
    }

    public CategorieDTO(String intitule, String valeur) {
        this.intitule = intitule;
        this.valeur = valeur;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CompetenceDTO getCompetence() {
        return competence;
    }

    public void setCompetence(CompetenceDTO competence) {
        this.competence = competence;
    }

    
}

