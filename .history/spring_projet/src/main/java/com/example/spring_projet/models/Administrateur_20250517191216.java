package com.example.spring_projet.models;

import jakarta.persistence.Entity;

@Entity
public class Administrateur extends Personne {
    private String password;

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
