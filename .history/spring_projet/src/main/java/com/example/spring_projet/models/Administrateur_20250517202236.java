package com.example.spring_projet.models;

import jakarta.persistence.Entity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Entity
public class Administrateur extends Personne implements UserDetails {

    private String password;

    // Getter et Setter
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // Implémentation des méthodes UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Ici tu peux définir les rôles ou permissions. Pour l'instant, vide.
        return Collections.emptyList();
    }

    @Override
    public String getUsername() {
        // Tu peux définir l’username comme l’email (présent dans Personne)
        return getEmail();  // supposé héritage de Personne qui a getEmail()
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // adapter selon ton besoin
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
