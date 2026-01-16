package com.example.spring_projet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.spring_projet.dto.StagiaireDTO;
import com.example.spring_projet.models.Stagiaire;
import com.example.spring_projet.repository.StagiaireRepository;

@Service
public class StagiaireService {
    private final StagiaireRepository stagiaireRepository;
    private final ModelMapper modelMapper;

    public StagiaireService(StagiaireRepository repo, ModelMapper mapper) {
        this.stagiaireRepository = repo;
        this.modelMapper = mapper;
    }

    public List<StagiaireDTO> getAll() {
        return stagiaireRepository.findAll().stream()
            .map(stagiaire -> modelMapper.map(stagiaire, StagiaireDTO.class))
            .collect(Collectors.toList());
    }

    public StagiaireDTO save(StagiaireDTO dto) {
       if (stagiaireRepository.findByEmail(dto.getEmail()).isPresent()) {
           return stagiaireRepository.findByEmail(dto.getEmail())
               .map(stagiaire -> modelMapper.map(stagiaire, StagiaireDTO.class))
               .orElse(null);
       }
        Stagiaire entity = modelMapper.map(dto, Stagiaire.class);
        entity = stagiaireRepository.save(entity);
        return modelMapper.map(entity, StagiaireDTO.class);
    }


    public long getTotalStagiaires() {
        return stagiaireRepository.count();
    }
}

