package com.example.spring_projet.service;

import com.example.spring_projet.models.Administrateur;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.example.spring_projet.repository.AdministrateurRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final AdministrateurDetailsService administrateurDetailsService;

    public SecurityConfig(AdministrateurDetailsService administrateurDetailsService) {
        this.administrateurDetailsService = administrateurDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
          .authorizeHttpRequests(auth -> auth
              .anyRequest().authenticated()
          )
          .userDetailsService(administrateurDetailsService)
          .formLogin(withDefaults());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
