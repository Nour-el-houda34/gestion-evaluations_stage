package com.example.spring_projet.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.spring_projet.service.AppreciationService;

@RestController
@RequestMapping("/api/statistiques")
public class StattistiqueController {

@Autowired
    private AppreciationService appreciationService;
@GetMapping
    public ResponseEntity<Map<String, Map<String, Double>>> getStats() {
        return ResponseEntity.ok(appreciationService.getStatistiques());
    }
    
}
