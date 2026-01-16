package com.example.spring_projet.controller;

import com.example.spring_projet.models.Administrateur;
import com.example.spring_projet.repository.AdministrateurRepository;
import com.example.spring_projet.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AdministrateurRepository adminRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Administrateur> optionalAdmin = adminRepo.findByEmail(email);

        if (optionalAdmin.isPresent()) {
            Administrateur admin = optionalAdmin.get();

            if (admin.getPassword().equals(password)) {
                String token = jwtUtil.generateToken(email);
                return ResponseEntity.ok(Map.of(
                    "message", "Authentification réussie",
                    "token", token,
                    "email", email
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Mot de passe incorrect"));
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Email non trouvé"));
        }
    }
}
