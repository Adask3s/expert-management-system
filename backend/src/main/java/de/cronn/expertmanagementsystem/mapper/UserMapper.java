package de.cronn.expertmanagementsystem.mapper;

import de.cronn.expertmanagementsystem.entity.Role;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.model.UserDto;
import de.cronn.expertmanagementsystem.model.UserListItemDto;
import de.cronn.expertmanagementsystem.model.UserListPageDto;
import de.cronn.expertmanagementsystem.model.UserRequestDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {UserSkillMapper.class})
public interface UserMapper {

    UserDto toDto(User entity);

    UserListItemDto toListItemDto(User entity);

    // request DTO -> new entity
    @Mapping(target = "id", ignore = true)
    User toEntity(UserRequestDto requestDto);

    default List<String> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(Role::toString) // lub np. Role::getName
                .toList();
    }

    @Mapping(target = "id", ignore = true)
    void updateUserFromRequestDto(UserRequestDto requestDto, @MappingTarget User entity);

    // paging is optional
    default UserListPageDto toUserListPageDto(Page<UserListItemDto> page) {
        UserListPageDto listPage = new UserListPageDto();
        listPage.setContent(page.getContent());
        listPage.setTotalElements((int) page.getTotalElements());
        listPage.setTotalPages(page.getTotalPages());
        listPage.setSize(page.getSize());
        listPage.setNumber(page.getNumber());
        return listPage;
    }
}