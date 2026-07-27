package de.cronn.expertmanagementsystem.mapper;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.model.DomainDto;
import de.cronn.expertmanagementsystem.model.DomainRequestDto;
import org.springframework.stereotype.Component;

@Component
public class DomainMapper {

    public DomainDto toDto(Domain domain) {
        if (domain == null) {
            return null;
        }
        DomainDto dto = new DomainDto();
        if (domain.getId() != null) {
            dto.setId(domain.getId().intValue());
        }
        dto.setName(domain.getName());
        dto.setDescription(domain.getDescription());
        return dto;
    }

    public Domain toEntity(DomainRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }
        Domain domain = new Domain();
        domain.setName(requestDto.getName());
        domain.setDescription(requestDto.getDescription());
        return domain;
    }

    public Domain toEntity(DomainDto dto) {
        if (dto == null) {
            return null;
        }
        Domain domain = new Domain();
        if (dto.getId() != null) {
            domain.setId(dto.getId().longValue());
        }
        domain.setName(dto.getName());
        return domain;
    }
}