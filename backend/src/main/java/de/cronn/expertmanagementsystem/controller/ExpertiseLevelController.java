package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.ExpertiseLevelsApi;
import de.cronn.expertmanagementsystem.model.ExpertiseLevelDto;
import de.cronn.expertmanagementsystem.service.ExpertiseLevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ExpertiseLevelController implements ExpertiseLevelsApi {
    private final ExpertiseLevelService expertiseLevelService;

    @Override
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExpertiseLevelDto>> expertiseLevelsGet() {
        return ResponseEntity.ok(expertiseLevelService.getAllExpertiseLevels());
    }
}
