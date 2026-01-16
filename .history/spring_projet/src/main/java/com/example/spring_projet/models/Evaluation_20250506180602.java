package com.example.spring_projet.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;



@Entity
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 
    private String categorie;

    private String valeur; // Par exemple : "Bonne", "Très bonne", etc.

    // Si nécessaire, tu peux aussi lier à une Appreciation, ou à une Période
    @ManyToOne
    private Appreciation appreciation;

    public Evaluation() {
    }

    public Evaluation(Long id, String categorie, String valeur, Appreciation appreciation) {
        this.id = id;
        this.categorie = categorie;
        this.valeur = valeur;
        this.appreciation = appreciation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Appreciation getAppreciation() {
        return appreciation;
    }

    public void setAppreciation(Appreciation appreciation) {
        this.appreciation = appreciation;
    }

    

}
