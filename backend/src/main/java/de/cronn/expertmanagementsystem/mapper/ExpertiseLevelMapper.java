package de.cronn.expertmanagementsystem.mapper;

import de.cronn.expertmanagementsystem.entity.ExpertiseLevel;
import de.cronn.expertmanagementsystem.model.ExpertiseLevelDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExpertiseLevelMapper {
    ExpertiseLevel toEntity(ExpertiseLevelDto expertiseLevelDto);

    ExpertiseLevelDto toDto(ExpertiseLevel expertiseLevelEntity);
}
