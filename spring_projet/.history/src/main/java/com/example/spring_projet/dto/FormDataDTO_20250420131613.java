package com.example.spring_projet.dto;



public class FormDataDTO {
    private StagiaireDTO stagiaire;
    private StageDTO stage;
    private TuteurDTO tuteur;
    private PeriodeDTO periode;
    private AppreciationDTO appreciation;

    // Getters et setters
    public StagiaireDTO getStagiaire() {
        return stagiaire;
    }

    public void setStagiaire(StagiaireDTO stagiaire) {
        this.stagiaire = stagiaire;
    }

    public StageDTO getStage() {
        return stage;
    }

    public void setStage(StageDTO stage) {
        this.stage = stage;
    }

    public TuteurDTO getTuteur() {
        return tuteur;
    }

    public void setTuteur(TuteurDTO tuteur) {
        this.tuteur = tuteur;
    }

    public PeriodeDTO getPeriode() {
        return periode;
    }

    public void setPeriode(PeriodeDTO periode) {
        this.periode = periode;
    }

    public AppreciationDTO getAppreciation() {
        return appreciation;
    }

    public void setAppreciation(AppreciationDTO appreciation) {
        this.appreciation = appreciation;
    }
}
