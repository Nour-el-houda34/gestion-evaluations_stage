/* package com.example.spring_projet.service;

import com.example.spring_projet.models.Administrateur;
import com.example.spring_projet.repository.AdministrateurRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AdministrateurDetailsService implements UserDetailsService {

    private final AdministrateurRepository administrateurRepository;

    public AdministrateurDetailsService(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Administrateur admin = administrateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Administrateur non trouvé"));

        return new org.springframework.security.core.userdetails.User(
                admin.getEmail(),
                admin.getPassword(),
                Collections.emptyList()
        );
    }
}
 */