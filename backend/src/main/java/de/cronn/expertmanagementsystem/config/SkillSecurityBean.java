package de.cronn.expertmanagementsystem.config;

import de.cronn.expertmanagementsystem.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("skillSecurity")
@RequiredArgsConstructor
public class SkillSecurityBean {
    private final UserSkillRepository userSkillRepository;

    public boolean isOwner(Long skillId, Long userId) {
        return userSkillRepository.findById(skillId.intValue())
                .map(skill -> skill.getUser().getId().equals(userId))
                .orElse(false);
    }
}