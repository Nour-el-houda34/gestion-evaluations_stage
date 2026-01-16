package com.example.spring_projet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.spring_projet.dto.StagiaireDTO;
import com.example.spring_projet.dto.TuteurDTO;
import com.example.spring_projet.models.Tuteur;
import com.example.spring_projet.repository.TuteurRepository;

@Service
public class TuteurService {
    private final TuteurRepository tuteurRepository;
    private final ModelMapper modelMapper;

    public TuteurService(TuteurRepository repo, ModelMapper mapper) {
        this.tuteurRepository = repo;
        this.modelMapper = mapper;
    }

    public List<TuteurDTO> getAll() {
        return tuteurRepository.findAll().stream()
            .map(tuteur -> modelMapper.map(tuteur, TuteurDTO.class))
            .collect(Collectors.toList());
    }

    public TuteurDTO save(TuteurDTO dto) {
        if (tuteurRepository.findByEmail(dto.getEmail()).isPresent()) {
           return tuteurRepository.findByEmail(dto.getEmail())
               .map(tuteur -> modelMapper.map(tuteur, TuteurDTO.class))
               .orElse(null);
       }
        Tuteur entity = modelMapper.map(dto, Tuteur.class);
        entity = tuteurRepository.save(entity);
        return modelMapper.map(entity, TuteurDTO.class);
    }

    public long getTotalTuteurs() {
        return tuteurRepository.count();
    }
}

