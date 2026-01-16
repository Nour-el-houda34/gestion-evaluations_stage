package com.example.spring_projet.controller;

import com.example.spring_projet.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> user) {
        String email = user.get("email");
        String password = user.get("password");

        // Simule une validation (à remplacer avec vraie vérification depuis la BDD)
        if ("bahia@gmail.com".equals(email) && "123456".equals(password)) {
            String token = jwtUtil.generateToken(email);
            return Map.of(
                "message", "Authentification réussie",
                "token", token,
                "email", email
            );
        } else {
            return Map.of("error", "Email ou mot de passe incorrect");
        }
    }
}
