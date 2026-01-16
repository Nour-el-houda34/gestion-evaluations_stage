package com.example.spring_projet.dto;

public class PeriodeIdDTO {
    private Long stagiaireId;
    private Long stageId;

    public PeriodeIdDTO() {
    }

    public PeriodeIdDTO(Long stagiaireId, Long stageId) {
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

