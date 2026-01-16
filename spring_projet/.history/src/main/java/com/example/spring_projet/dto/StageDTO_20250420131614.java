package com.example.spring_projet.dto;

public class StageDTO {
    private Long id;
    private String description;
    private String objectif;
    private String entreprise;

    public StageDTO() {
    }

    public StageDTO(Long id, String description, String objectif, String entreprise) {
        this.id = id;
        this.description = description;
        this.objectif = objectif;
        this.entreprise = entreprise;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getObjectif() {
        return objectif;
    }

    public void setObjectif(String objectif) {
        this.objectif = objectif;
    }

    public String getEntreprise() {
        return entreprise;
    }

    public void setEntreprise(String entreprise) {
        this.entreprise = entreprise;
    }
}
