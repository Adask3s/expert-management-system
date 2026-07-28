package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.UsersApi;
import de.cronn.expertmanagementsystem.model.*;
import de.cronn.expertmanagementsystem.service.UserService;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<UserListPageDto> usersGet(Integer page, Integer size) {
        UserListPageDto userListPageDto = userService.getAllUsers(page, size);
        return ResponseEntity.ok(userListPageDto);
    }

    @Override
    public ResponseEntity<Void> usersIdDelete(Integer id) {
        userService.deleteUser(id.longValue());
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<UserDto> usersIdGet(Integer id) {
        UserDto userDto = userService.getUserById(id.longValue());
        return ResponseEntity.ok(userDto);
    }

    @Override
    public ResponseEntity<UserDto> usersIdPut(Integer id, UserRequestDto userRequestDto) {
        UserDto updatedUser = userService.updateUser(id.longValue(), userRequestDto);
        return ResponseEntity.ok(updatedUser);
    }

    @Override
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
    public ResponseEntity<Void> usersUserIdRolesPost(Integer userId, RoleRequestDto roleRequestDto) {
        // 201
        return null;
    }

    // user_roles table
    @Override
    public ResponseEntity<Void> usersUserIdRolesRoleNameDelete(Integer userId, String roleName) {
        // 204
        return null;
    }

    // user_skills table
    @Override
    public ResponseEntity<List<UserSkillDetailDto>> usersUserIdSkillsGet(Integer userId) {
        List<UserSkillDetailDto> userSkills = userSkillService.getUserSkills(userId.longValue());
        return ResponseEntity.ok(userSkills);
    }

    // user_skills table
    @Override
    public ResponseEntity<Void> usersUserIdSkillsPost(Integer userId, UserSkillRequestDto userSkillRequestDto) {
        userSkillService.createUserSkill(userId.longValue(), userSkillRequestDto);
        return ResponseEntity.noContent().build();
    }
}
