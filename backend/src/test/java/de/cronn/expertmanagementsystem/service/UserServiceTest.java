package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.mapper.UserMapper;
import de.cronn.expertmanagementsystem.model.UserDto;
import de.cronn.expertmanagementsystem.model.UserRequestDto;
import de.cronn.expertmanagementsystem.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private DatabaseCredentialsProvider credentialsProvider;

    @InjectMocks
    private UserService userService;

    // getUserById
    @Test
    void getUserByIdShouldReturnUserDtoWhenUserExists() {
        // given
        Long userId = 1L;
        User user = new User();
        UserDto expectedDto = new UserDto();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userMapper.toDto(user)).thenReturn(expectedDto);

        // when
        UserDto actualDto = userService.getUserById(userId);

        // then
        assertThat(actualDto).isSameAs(expectedDto);
    }

    @Test
    void getUserByIdShouldThrowExceptionWhenUserDoesNotExist() {
        // given
        Long userId = 99L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.getUserById(userId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with id: 99");
    }

    // getAllUsers - should probably check if default pagination parameters are set correctly - to do after proper pagination implementation
    //@Test
    //void getAllUsers() {
    //}

    // deleteUser

    @Test
    void deleteUserShouldDeleteWhenUserExists() {
        // given
        Long userId = 1L;
        User user = new User();
        user.setEmail("test@example.com");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // when
        userService.deleteUser(userId);

        // then
        verify(credentialsProvider).deleteCredentials("test@example.com");
        verify(userRepository).deleteById(userId);
    }

    @Test
    void deleteUserShouldThrowExceptionAndNotDeleteWhenUserDoesNotExist() {
        // given
        Long userId = 99L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.deleteUser(userId))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with id: 99");

        verify(credentialsProvider, never()).deleteCredentials(any());
        verify(userRepository, never()).deleteById(any());
    }

    // updateUser

    @Test
    void updateUserShouldUpdateAndReturnDtoWhenUserExists() {
        // given
        Long userId = 1L;
        UserRequestDto requestDto = new UserRequestDto();
        User existingUser = new User();
        UserDto expectedDto = new UserDto();

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userMapper.toDto(existingUser)).thenReturn(expectedDto);

        // when
        UserDto result = userService.updateUser(userId, requestDto);

        // then
        assertThat(result).isSameAs(expectedDto);
        verify(userMapper).updateUserFromRequestDto(requestDto, existingUser);
    }

    @Test
    void updateUserShouldNotUpdateAndThrowExceptionWhenUserDoesNotExist() {
        // given
        Long userID = 1L;
        UserRequestDto requestDto = new UserRequestDto();
        requestDto.setFirstName("Olga");
        requestDto.setLastName("Nowak");
        requestDto.setEmail("o.nowak@gmail.com");
        requestDto.setActive(true);

        when(userRepository.findById(userID)).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.updateUser(userID, requestDto))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("User not found with id: " + userID);
    }

    @Test
    void createUserShouldSaveUserAndCreateDefaultCredentials() {
        // given
        UserRequestDto requestDto = new UserRequestDto();
        requestDto.setEmail("test@example.com");

        User userEntity = new User();
        userEntity.setEmail("test@example.com");
        UserDto expectedDto = new UserDto();

        when(userMapper.toEntity(requestDto)).thenReturn(userEntity);
        when(userRepository.save(any(User.class))).thenReturn(userEntity);
        when(userMapper.toDto(userEntity)).thenReturn(expectedDto);

        // when
        UserDto result = userService.createUser(requestDto);

        // then
        assertThat(result).isSameAs(expectedDto);
        verify(userRepository).save(userEntity);
        verify(credentialsProvider).createDefaultCredentials("test@example.com");
    }
}