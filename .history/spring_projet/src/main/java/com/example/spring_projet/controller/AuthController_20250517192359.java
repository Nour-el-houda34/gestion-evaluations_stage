/* package com.example.spring_projet.controller;

import com.example.spring_projet.security.JwtUtils;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final com.example.spring_projet.service.AdministrateurDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                          com.example.spring_projet.service.AdministrateurDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> credentials) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(credentials.get("email"), credentials.get("password"))
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(credentials.get("email"));
        String token = jwtUtils.generateToken(userDetails);
        return Map.of("token", token);
    }
}
 */