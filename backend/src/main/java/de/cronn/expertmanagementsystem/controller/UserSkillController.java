package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.UserSkillsApi;
import de.cronn.expertmanagementsystem.model.UserSkillRequestDto;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserSkillController implements UserSkillsApi {
    private final UserSkillService userSkillService;

    @Override
    // Custom bean shenanigans because we don't know user id here, only skill id
    @PreAuthorize("hasRole('ADMIN') or @skillSecurity.isOwner(#id.longValue(), authentication.principal.id)")
    public ResponseEntity<Void> userSkillsIdDelete(Integer id) {
        userSkillService.deleteUserSkill(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or @skillSecurity.isOwner(#id.longValue(), authentication.principal.id)")
    public ResponseEntity<Void> userSkillsIdPut(Integer id, UserSkillRequestDto userSkillRequestDto) {
        // Thought that it has to return the updated skill, but OpenApi spec says otherwise
        // UserSkillDetailDto updatedUserDto = userSkillService.updateUserSkill(id, userSkillRequestDto);
        return ResponseEntity.ok().build();
    }
}
