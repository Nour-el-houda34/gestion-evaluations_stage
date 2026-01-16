package com.example.spring_projet.models;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class PeriodeId implements Serializable {
    private Long stagiaireId;
    private Long stageId;

    
    public PeriodeId() {
    }


    public PeriodeId(Long stagiaireId, Long stageId) {
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
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

    
}
