package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.mapper.UserMapper;
import de.cronn.expertmanagementsystem.model.UserDto;
import de.cronn.expertmanagementsystem.model.UserListPageDto;
import de.cronn.expertmanagementsystem.model.UserListItemDto;
import de.cronn.expertmanagementsystem.model.UserRequestDto;
import de.cronn.expertmanagementsystem.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserListPageDto getAllUsers(Integer page, Integer size) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 10;

        Pageable pageable = PageRequest.of(pageNumber, pageSize);

        Page<UserListItemDto> userPage = userRepository.findAll(pageable)
                .map(userMapper::toListItemDto);

        return userMapper.toUserListPageDto(userPage);
    }

    // should make dedicated exception for these later
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }

    @Transactional
    public UserDto createUser(UserRequestDto userRequestDto) {
        User userToSave = userMapper.toEntity(userRequestDto);
        User savedUser = userRepository.save(userToSave);
        return userMapper.toDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long id, UserRequestDto userRequestDto) {
        User userEntity = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));

        userMapper.updateUserFromRequestDto(userRequestDto, userEntity);
        return userMapper.toDto(userEntity);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new EntityNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}