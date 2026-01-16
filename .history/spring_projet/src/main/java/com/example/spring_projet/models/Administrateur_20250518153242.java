package com.example.spring_projet.models;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
public class Administrateur extends Personne {

    private String password;

    // Getters and Setters
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}


