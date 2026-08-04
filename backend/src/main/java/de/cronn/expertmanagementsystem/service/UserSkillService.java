package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.entity.ExpertiseLevel;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.entity.UserSkill;
import de.cronn.expertmanagementsystem.mapper.UserSkillMapper;
import de.cronn.expertmanagementsystem.model.UserSkillDetailDto;
import de.cronn.expertmanagementsystem.model.UserSkillRequestDto;
import de.cronn.expertmanagementsystem.repository.DomainRepository;
import de.cronn.expertmanagementsystem.repository.ExpertiseLevelRepository;
import de.cronn.expertmanagementsystem.repository.UserRepository;
import de.cronn.expertmanagementsystem.repository.UserSkillRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSkillService {
    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final DomainRepository domainRepository;
    private final ExpertiseLevelRepository expertiseLevelRepository;
    private final UserSkillMapper userSkillMapper;

    @Transactional
    public List<UserSkillDetailDto> getUserSkills(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }
        List<UserSkill> userSkills = userSkillRepository.findByUserId(userId);
        return userSkillMapper.toDetailDtoList(userSkills);
    }

    @Transactional
    public void deleteUserSkill(Integer id) {
        if (!userSkillRepository.existsById(id)) {
            throw new EntityNotFoundException("UserSkill not found with id: " + id);
        }
        userSkillRepository.deleteById(id);
    }

    @Transactional
    public void createUserSkill(Long userId, UserSkillRequestDto requestDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Domain domain = domainRepository.findById(requestDto.getDomainId().longValue())
                .orElseThrow(() -> new EntityNotFoundException("Domain not found with id: " + requestDto.getDomainId()));

        ExpertiseLevel level = expertiseLevelRepository.findById(requestDto.getExpertiseLevelId())
                .orElseThrow(() -> new EntityNotFoundException("ExpertiseLevel not found with id: " + requestDto.getExpertiseLevelId()));

        if (userSkillRepository.existsByUserIdAndDomainId(userId, requestDto.getDomainId().longValue())) {
            throw new IllegalArgumentException("User already has skill assigned in domain id: " + requestDto.getDomainId());
        }

        UserSkill userSkill = new UserSkill();
        userSkill.setUser(user);
        userSkill.setDomain(domain);
        userSkill.setExpertiseLevel(level);

        userSkillRepository.save(userSkill);
    }

    @Transactional
    public UserSkillDetailDto updateUserSkill(Integer userSkillId, UserSkillRequestDto requestDto) {
        UserSkill existingSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new EntityNotFoundException("UserSkill not found with id: " + userSkillId));

        if (requestDto.getDomainId() != null) {
            Domain domain = domainRepository.findById(requestDto.getDomainId().longValue())
                    .orElseThrow(() -> new EntityNotFoundException("Domain not found with id: " + requestDto.getDomainId()));
            existingSkill.setDomain(domain);
        }

        if (requestDto.getExpertiseLevelId() != null) {
            ExpertiseLevel level = expertiseLevelRepository.findById(requestDto.getExpertiseLevelId())
                    .orElseThrow(() -> new EntityNotFoundException("ExpertiseLevel not found with id: " + requestDto.getExpertiseLevelId()));
            existingSkill.setExpertiseLevel(level);
        }

        return userSkillMapper.toDetailDto(existingSkill);
    }
}
