package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;



@Entity
public class Appreciation {
    @EmbeddedId
    private AppreciationId id;

    @MapsId("periodeId")
    @OneToOne
    private Periode periode;

    @MapsId("tuteurId")
    @ManyToOne
    private Tuteur tuteur;

    

   

    @OneToMany(mappedBy = "appreciation", cascade = CascadeType.ALL)
    private List<Evaluation> evaluations = new ArrayList<>();

    @OneToMany(mappedBy = "appreciation", cascade = CascadeType.ALL)
    private List<Competence> competences = new ArrayList<>();

    // Getters and Setters
    public AppreciationId getId() 
    { 
        return id; 
    }


    public void setId(AppreciationId id) { 
        this.id = id; 
    }
    public Periode getPeriode() { 
        return periode; 
    }
    public void setPeriode(Periode periode) { 
        this.periode = periode; 
    }
    public Tuteur getTuteur() {
         return tuteur; 
        }


    public void setTuteur(Tuteur tuteur) 
    { 
        this.tuteur = tuteur; 
    }
   
   
    public List<Evaluation> getEvaluations() { 
        return evaluations; 
    }
    public void setEvaluations(List<Evaluation> evaluations) { 
        this.evaluations = evaluations;
     }
    public List<Competence> getCompetence() { 
        return competences; 
    }
    public void setCompetence(List<Competence> competence) { 
        this.competences = competence; 
    }
}

