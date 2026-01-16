package com.example.spring_projet.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    // Endpoint POST pour s'authentifier
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        try {
            // Crée un token d'authentification avec email et password
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
            );

            // Si authentification réussie, on peut retourner un message ou un token JWT, etc.
            return Map.of("message", "Authentification réussie", "email", email);

        } catch (AuthenticationException e) {
            // En cas d’échec, retourne un message d’erreur
            return Map.of("error", "Email ou mot de passe incorrect");
        }
    }
}
