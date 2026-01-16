package com.example.spring_projet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // désactive CSRF pour tests
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register").permitAll() // accès public
                .anyRequest().authenticated() // sinon authentifié
            )
            .formLogin(Customizer.withDefaults()) // formulaire login par défaut
            .httpBasic(Customizer.withDefaults()); // basic auth

        return http.build();
    }
}
