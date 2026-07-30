package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.UsersApi;
import de.cronn.expertmanagementsystem.model.*;
import de.cronn.expertmanagementsystem.service.UserService;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

// Some of the endpoints take in Integer values for id, instead of Long, should be fixed in openapi specs later.
// current workaround is to do id.longValue()
@RestController
@RequiredArgsConstructor
public class UserController implements UsersApi {
    private final UserSkillService userSkillService;
    private final UserService userService;

    @Override
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserListPageDto> usersGet(String search, Integer page, Integer size) {
        UserListPageDto userListPageDto = userService.getAllUsers(search, page, size);
        return ResponseEntity.ok(userListPageDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> usersIdDelete(Integer id) {
        userService.deleteUser(id.longValue());
        return ResponseEntity.noContent().build();
    }

    @Override
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDto> usersIdGet(Integer id) {
        UserDto userDto = userService.getUserById(id.longValue());
        return ResponseEntity.ok(userDto);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or #id.longValue() == authentication.principal.id")
    public ResponseEntity<UserDto> usersIdPut(Integer id, UserRequestDto userRequestDto) {
        UserDto updatedUser = userService.updateUser(id.longValue(), userRequestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> usersPost(UserRequestDto userRequestDto) {
        UserDto createdUser = userService.createUser(userRequestDto);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }

    // user_roles table
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> usersUserIdRolesPost(Integer userId, RoleRequestDto roleRequestDto) {
        userService.addRoleToUser(userId.longValue(), roleRequestDto.getRoleName());

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{roleName}")
                .buildAndExpand(roleRequestDto.getRoleName())
                .toUri();

        return ResponseEntity.created(location).build();
    }

    // user_roles table
    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> usersUserIdRolesRoleNameDelete(Integer userId, String roleName) {
        userService.removeRoleFromUser(userId.longValue(), roleName);
        return ResponseEntity.noContent().build();
    }

    // user_skills table
    @Override
    @PreAuthorize("hasRole('ADMIN') or #userId.longValue() == authentication.principal.id")
    public ResponseEntity<List<UserSkillDetailDto>> usersUserIdSkillsGet(Integer userId) {
        List<UserSkillDetailDto> userSkills = userSkillService.getUserSkills(userId.longValue());
        return ResponseEntity.ok(userSkills);
    }

    // user_skills table
    @Override
    @PreAuthorize("hasRole('ADMIN') or #userId.longValue() == authentication.principal.id")
    public ResponseEntity<Void> usersUserIdSkillsPost(Integer userId, UserSkillRequestDto userSkillRequestDto) {
        userSkillService.createUserSkill(userId.longValue(), userSkillRequestDto);
        return ResponseEntity.noContent().build();
    }
}
