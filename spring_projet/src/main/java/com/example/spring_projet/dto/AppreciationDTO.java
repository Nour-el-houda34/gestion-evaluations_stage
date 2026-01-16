package com.example.spring_projet.dto;

import java.util.List;

public class AppreciationDTO {
    private Long tuteurId;
    private PeriodeIdDTO periodeId;
    private List<EvaluationDTO> evaluations;
    private List<CompetenceDTO> competences;

    // Default constructor
    public AppreciationDTO() {
    }

    // Parameterized constructor
    public AppreciationDTO(Long tuteurId, PeriodeIdDTO periodeId, List<EvaluationDTO> evaluations, List<CompetenceDTO> competences) {
        this.tuteurId = tuteurId;
        this.periodeId = periodeId;
        this.evaluations = evaluations;
        this.competences = competences;
    }

    // Getters and Setters
    public Long getTuteurId() {
        return tuteurId;
    }

    public void setTuteurId(Long tuteurId) {
        this.tuteurId = tuteurId;
    }

    public PeriodeIdDTO getPeriodeId() {
        return periodeId;
    }

    public void setPeriodeId(PeriodeIdDTO periodeId) {
        this.periodeId = periodeId;
    }

    public List<EvaluationDTO> getEvaluations() {
        return evaluations;
    }

    public void setEvaluations(List<EvaluationDTO> evaluations) {
        this.evaluations = evaluations;
    }

    public List<CompetenceDTO> getCompetences() {
        return competences;
    }

    public void setCompetences(List<CompetenceDTO> competences) {
        this.competences = competences;
    }
}
