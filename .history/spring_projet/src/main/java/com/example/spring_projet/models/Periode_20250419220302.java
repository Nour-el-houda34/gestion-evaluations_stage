package com.example.spring_projet.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;

@Entity
public class Periode {
    @EmbeddedId
    private PeriodeId id;

    @ManyToOne
    @MapsId("stagiaireId")
    private Stagiaire stagiaire;

    @ManyToOne
    @MapsId("stageId")
    private Stage stage;

    private LocalDate dateDebut;
    private LocalDate dateFin;

      @OneToMany(mappedBy = "periode")
    private List<Appreciation> appreciations = new ArrayList<>();

    // Getters and Setters
    public PeriodeId getId() { return id; }
    public void setId(PeriodeId id) { this.id = id; }
    public Stagiaire getStagiaire() { return stagiaire; }
    public void setStagiaire(Stagiaire stagiaire) { this.stagiaire = stagiaire; }
    public Stage getStage() { return stage; }
    public void setStage(Stage stage) { this.stage = stage; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public List<Appreciation> getAppreciations() {
        return appreciations;
    }
    public void setAppreciations(List<Appreciation> appreciations) {
        this.appreciations = appreciations;
    }
    
    
}