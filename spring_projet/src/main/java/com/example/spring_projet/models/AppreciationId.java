package com.example.spring_projet.models;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class AppreciationId implements Serializable {
    private PeriodeId periodeId;
    private Long tuteurId;
    
    public AppreciationId() {
    }
    public AppreciationId(PeriodeId periodeId, Long tuteurId) {
        this.periodeId = periodeId;
        this.tuteurId = tuteurId;
    }
    public PeriodeId getPeriodeId() {
        return periodeId;
    }
    public void setPeriodeId(PeriodeId periodeId) {
        this.periodeId = periodeId;
    }
    public Long getTuteurId() {
        return tuteurId;
    }
    public void setTuteurId(Long tuteurId) {
        this.tuteurId = tuteurId;
    }


}