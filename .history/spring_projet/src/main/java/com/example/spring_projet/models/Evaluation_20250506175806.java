package com.example.spring_projet.models;

import com.example.spring_projet.enums.ValeurEvaluation;
import jakarta.persistence.*;

@Entity
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String categorie;

    @Enumerated(EnumType.STRING)
    private ValeurEvaluation valeur;

    @ManyToOne
    private Appreciation appreciation;

    public Evaluation() {}

    public Evaluation(Long id, String categorie, ValeurEvaluation valeur, Appreciation appreciation) {
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

    public ValeurEvaluation getValeur() {
        return valeur;
    }

    public void setValeur(ValeurEvaluation valeur) {
        this.valeur = valeur;
    }

    public Appreciation getAppreciation() {
        return appreciation;
    }

    public void setAppreciation(Appreciation appreciation) {
        this.appreciation = appreciation;
    }
}
