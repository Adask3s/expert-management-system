package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.mapper.ExpertiseLevelMapper;
import de.cronn.expertmanagementsystem.model.ExpertiseLevelDto;
import de.cronn.expertmanagementsystem.repository.ExpertiseLevelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpertiseLevelService {
    private final ExpertiseLevelRepository expertiseLevelRepository;
    private final ExpertiseLevelMapper expertiseLevelMapper;

    @Transactional
    public List<ExpertiseLevelDto> getAllExpertiseLevels() {
        return expertiseLevelRepository.findAll().stream()
                .map(expertiseLevelMapper::toDto)
                .toList();
    }
}
