/* package com.example.spring_projet.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.example.spring_projet.models.Administrateur;
import com.example.spring_projet.repository.AdministrateurRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdministrateurRepository administrateurRepository;

    public DataInitializer(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si un admin existe déjà
        if (administrateurRepository.count() == 0) {
            Administrateur admin = new Administrateur();
            admin.setEmail("bahia@gmail.com");
            admin.setPassword("bahia123");  // ici tu peux hasher le mot de passe
            admin.setNom("Admin");
            admin.setPrenom("Super");
            administrateurRepository.save(admin);
            System.out.println("Administrateur initial créé");
        } else {
            System.out.println("Administrateur déjà présent");
        }
    }
}
 */