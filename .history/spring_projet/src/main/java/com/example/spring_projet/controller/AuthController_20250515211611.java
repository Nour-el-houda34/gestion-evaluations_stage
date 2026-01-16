package com.example.spring_projet.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    // Endpoint pour vérifier l'utilisateur connecté (exemple)
    @GetMapping("/login")
    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return "Aucun utilisateur connecté";
        }
        // On retourne simplement le nom d'utilisateur (email ici)
        return "Utilisateur connecté : " + authentication.getName();
    }
}

