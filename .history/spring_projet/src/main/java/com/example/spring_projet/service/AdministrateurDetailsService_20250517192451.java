/* package com.example.spring_projet.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdministrateurDetailsService implements UserDetailsService {

    // Ici, tu dois injecter ton repository d'Administrateur ou User
    // Par exemple : private final AdministrateurRepository adminRepo;

    // public AdministrateurDetailsService(AdministrateurRepository adminRepo) {
    //     this.adminRepo = adminRepo;
    // }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Simplicité : on retourne un utilisateur en dur, à adapter à ta logique réelle
        if ("admin".equals(username)) {
            // Exemple simple avec un utilisateur admin "admin", mot de passe "password", rôle ADMIN
            return org.springframework.security.core.userdetails.User
                    .withUsername("admin")
                    .password("{noop}password") // {noop} = mot de passe en clair (pas sûr en prod)
                    .roles("ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("Utilisateur non trouvé : " + username);
    }
}
 */