package com.example.spring_projet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ou activer si besoin
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // routes publiques
                .anyRequest().authenticated()                // tout le reste nécessite l'auth
            );
        return http.build();
    }
}
