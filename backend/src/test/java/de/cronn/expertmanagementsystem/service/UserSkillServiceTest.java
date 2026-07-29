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

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserSkillServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private UserSkillRepository userSkillRepository;
    @Mock
    private DomainRepository domainRepository;
    @Mock
    private ExpertiseLevelRepository expertiseLevelRepository;
    @Mock
    private UserSkillMapper userSkillMapper;

    @InjectMocks
    private UserSkillService userSkillService;

    // getUserSkills
    @Test
    void getUserSkillsShouldReturnDtoListWhenUserExists() {
        // given
        Long userId = 1L;
        List<UserSkill> userSkills = List.of(new UserSkill());
        List<UserSkillDetailDto> expectedDtos = List.of(new UserSkillDetailDto());

        when(userRepository.existsById(userId)).thenReturn(true);
        when(userSkillRepository.findByUserId(userId)).thenReturn(userSkills);
        when(userSkillMapper.toDetailDtoList(userSkills)).thenReturn(expectedDtos);

        // when
        List<UserSkillDetailDto> actualDtos = userSkillService.getUserSkills(userId);

        // then
        assertThat(actualDtos).isSameAs(expectedDtos);
    }

    @Test
    void getUserSkillsShouldThrowExceptionWhenUserDoesNotExist() {
        // given
        Long userId = 99L;
        when(userRepository.existsById(userId)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userSkillService.getUserSkills(userId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with id: " + userId);
    }

    // deleteUserSkill
    @Test
    void deleteUserSkillShouldDeleteWhenSkillExists() {
        // given
        Integer skillId = 1;
        when(userSkillRepository.existsById(skillId)).thenReturn(true);

        // when
        userSkillService.deleteUserSkill(skillId);

        // then
        verify(userSkillRepository).deleteById(skillId);
    }

    @Test
    void deleteUserSkillShouldThrowExceptionWhenSkillDoesNotExist() {
        // given
        Integer skillId = 99;
        when(userSkillRepository.existsById(skillId)).thenReturn(false);

        // when & then
        assertThatThrownBy(() -> userSkillService.deleteUserSkill(skillId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("UserSkill not found with id: " + skillId);

        verify(userSkillRepository, never()).deleteById(any());
    }

    // createUserSkill
    @Test
    void createUserSkillShouldSaveWhenDataIsCorrectAndNoDuplicates() {
        // given
        Long userId = 1L;
        UserSkillRequestDto requestDto = new UserSkillRequestDto();
        requestDto.setDomainId(10);
        requestDto.setExpertiseLevelId(2);

        User user = new User();
        Domain domain = new Domain();
        ExpertiseLevel level = new ExpertiseLevel();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(domainRepository.findById(10L)).thenReturn(Optional.of(domain));
        when(expertiseLevelRepository.findById(2)).thenReturn(Optional.of(level));
        when(userSkillRepository.existsByUserIdAndDomainId(userId, 10L)).thenReturn(false);

        // when
        userSkillService.createUserSkill(userId, requestDto);

        // then
        verify(userSkillRepository).save(any(UserSkill.class));
    }

    @Test
    void createUserSkillShouldThrowExceptionWhenDuplicateSkillExists() {
        // given
        Long userId = 1L;
        UserSkillRequestDto requestDto = new UserSkillRequestDto();
        requestDto.setDomainId(10);
        requestDto.setExpertiseLevelId(2);

        when(userRepository.findById(userId)).thenReturn(Optional.of(new User()));
        when(domainRepository.findById(10L)).thenReturn(Optional.of(new Domain()));
        when(expertiseLevelRepository.findById(2)).thenReturn(Optional.of(new ExpertiseLevel()));
        when(userSkillRepository.existsByUserIdAndDomainId(userId, 10L)).thenReturn(true);

        // when & then
        assertThatThrownBy(() -> userSkillService.createUserSkill(userId, requestDto))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User already has skill assigned in domain id: 10");

        verify(userSkillRepository, never()).save(any());
    }

    // updateUserSkill
    @Test
    void updateUserSkillShouldUpdateDomainAndLevelWhenBothProvided() {
        // given
        Integer skillId = 1;
        UserSkillRequestDto requestDto = new UserSkillRequestDto();
        requestDto.setDomainId(10);
        requestDto.setExpertiseLevelId(2);

        UserSkill existingSkill = new UserSkill();
        Domain domain = new Domain();
        ExpertiseLevel level = new ExpertiseLevel();
        UserSkillDetailDto expectedDto = new UserSkillDetailDto();

        when(userSkillRepository.findById(skillId)).thenReturn(Optional.of(existingSkill));
        when(domainRepository.findById(10L)).thenReturn(Optional.of(domain));
        when(expertiseLevelRepository.findById(2)).thenReturn(Optional.of(level));
        when(userSkillMapper.toDetailDto(existingSkill)).thenReturn(expectedDto);

        // when
        UserSkillDetailDto actualDto = userSkillService.updateUserSkill(skillId, requestDto);

        // then
        assertThat(actualDto).isSameAs(expectedDto);
        assertThat(existingSkill.getDomain()).isEqualTo(domain);
        assertThat(existingSkill.getExpertiseLevel()).isEqualTo(level);
    }
}