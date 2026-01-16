package com.example.spring_projet.dto;

import java.time.LocalDate;

public class PeriodeDTO {
    private Long stagiaireId;
    private Long stageId;
    private LocalDate dateDebut;
    private LocalDate dateFin;

    public PeriodeDTO() {
    }

    public PeriodeDTO(Long stagiaireId, Long stageId, LocalDate dateDebut, LocalDate dateFin) {
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    public Long getStagiaireId() {
        return stagiaireId;
    }

    public void setStagiaireId(Long stagiaireId) {
        this.stagiaireId = stagiaireId;
    }

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}

