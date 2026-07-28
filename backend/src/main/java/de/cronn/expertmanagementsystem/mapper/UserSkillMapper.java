package de.cronn.expertmanagementsystem.mapper;

import de.cronn.expertmanagementsystem.entity.UserSkill;
import de.cronn.expertmanagementsystem.model.UserSkillDetailDto;
import de.cronn.expertmanagementsystem.model.UserSkillDto;
import de.cronn.expertmanagementsystem.model.UserSkillRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserSkillMapper {
    @Mapping(target = "id", ignore = true)
    UserSkill toEntity(UserSkillDto userSkillDto);

    UserSkillDto toDto(UserSkill userSkillEntity);

    UserSkill toEntity(UserSkillRequestDto userSkillRequestDto);

    List<UserSkillDetailDto> toDetailDtoList(List<UserSkill> userSkillsEntityList);

    @Mapping(target = "domainName", source = "domain.name")
    @Mapping(target = "levelName", source = "expertiseLevel.name")
    @Mapping(target = "rankValue", source = "expertiseLevel.rankValue")
    UserSkillDetailDto toDetailDto(UserSkill userSkillEntity);

    @Mapping(target = "id", ignore = true)
    void updateUserSkillFromDto(UserSkillRequestDto requestDto, @MappingTarget UserSkill entity);
}
