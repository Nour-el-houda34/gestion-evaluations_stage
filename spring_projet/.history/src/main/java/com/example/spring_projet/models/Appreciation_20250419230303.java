package com.example.spring_projet.models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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

    private String implication;
    private String ouverture;
    private String qualiteProduction;

    @Column(columnDefinition = "TEXT")
    private String observation;

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
    public String getImplication() { 
        return implication; 
    }
    public void setImplication(String implication) { 
        this.implication = implication; 
    }
    public String getOuverture() { 
        return ouverture; 
    }
    public void setOuverture(String ouverture) { 
        this.ouverture = ouverture; 
    }
    public String getQualiteProduction() { 
        return qualiteProduction; 
    }
    public void setQualiteProduction(String qualiteProduction) { 
        this.qualiteProduction = qualiteProduction;
     }
    public String getObservation() { 
        return observation;
     }
    public void setObservation(String observation) {
         this.observation = observation;
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

