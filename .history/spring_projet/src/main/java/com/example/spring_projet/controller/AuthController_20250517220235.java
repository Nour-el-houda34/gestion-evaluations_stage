package com.example.spring_projet.controller;

import com.example.spring_projet.repository.AdministrateurRepository;
import com.example.spring_projet.security.JwtUtil;
import com.example.spring_projet.models.Administrateur;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private AdministrateurRepository adminRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        String email = authRequest.getEmail();
        String password = authRequest.getPassword();

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

// Add these classes if they do not exist elsewhere in your project
class AuthRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}


