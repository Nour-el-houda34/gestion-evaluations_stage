package com.example.spring_projet.service;

import com.example.spring_projet.models.Administrateur;
import com.example.spring_projet.repository.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class AdministrateurDetailsService implements UserDetailsService {

    @Autowired
    private AdministrateurRepository administrateurRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Administrateur admin = administrateurRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Administrateur non trouvé"));
        return new User(admin.getEmail(), admin.getPassword(), new ArrayList<>());
    }
}
