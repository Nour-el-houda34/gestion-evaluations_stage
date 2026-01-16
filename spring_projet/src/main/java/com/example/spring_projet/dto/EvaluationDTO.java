package com.example.spring_projet.dto;

public class EvaluationDTO {
    private String categorie;
    private String valeur; // Ex: "Bonne", "Très bonne"

    public EvaluationDTO() {
    }

    public EvaluationDTO(String categorie, String valeur) {
        this.categorie = categorie;
        this.valeur = valeur;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }
}

