package com.example.spring_projet.service;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.spring_projet.dto.StageDTO;
import com.example.spring_projet.models.Stage;
import com.example.spring_projet.repository.StageRepository;

@Service
public class StageService {
    private final StageRepository stageRepository;
    private final ModelMapper modelMapper;

    public StageService(StageRepository repo, ModelMapper mapper) {
        this.stageRepository = repo;
        this.modelMapper = mapper;
    }

    public List<StageDTO> getAll() {
        return stageRepository.findAll().stream()
            .map(stage -> modelMapper.map(stage, StageDTO.class))
            .collect(Collectors.toList());
    }

    public StageDTO save(StageDTO dto) {
        Stage entity = modelMapper.map(dto, Stage.class);
        entity = stageRepository.save(entity);
        return modelMapper.map(entity, StageDTO.class);
    }

    public long getTotalStages() {
        return stageRepository.count();
    }
}

