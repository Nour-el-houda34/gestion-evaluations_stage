package com.example.spring_projet.dto;

import java.util.List;

public class CompetenceDTO {
    private String intitule;
    private Integer note; // Note sur 20
    private List<CategorieDTO> categories;

    public CompetenceDTO() {
    }

    public CompetenceDTO(String intitule, Integer note, List<CategorieDTO> categories) {
        this.intitule = intitule;
        this.note = note;
        this.categories = categories;
    }

    public String getIntitule() {
        return intitule;
    }

    public void setIntitule(String intitule) {
        this.intitule = intitule;
    }

    public Integer getNote() {
        return note;
    }

    public void setNote(Integer note) {
        this.note = note;
    }

    public List<CategorieDTO> getCategories() {
        return categories;
    }

    public void setCategories(List<CategorieDTO> categories) {
        this.categories = categories;
    }
}
