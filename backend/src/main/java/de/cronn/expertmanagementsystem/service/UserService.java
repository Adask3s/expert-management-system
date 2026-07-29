package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.mapper.UserMapper;
import de.cronn.expertmanagementsystem.model.*;
import de.cronn.expertmanagementsystem.repository.UserRepository;
import de.cronn.expertmanagementsystem.service.search.SearchCriteriaBuilder;
import de.cronn.expertmanagementsystem.service.search.SearchQuery;
import de.cronn.expertmanagementsystem.service.search.SearchQueryBuilder;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final EntityManager entityManager;
    private final SearchCriteriaBuilder searchCriteriaBuilder;
    private final SearchQueryBuilder searchQueryBuilder;

    @Transactional(readOnly = true)
    public UserListPageDto getAllUsers(String search, Integer page, Integer size) {
        int pageNumber = (page != null) ? page : 0;
        int pageSize = (size != null) ? size : 10;

        String searchPattern = null;
        if (search != null && !search.isBlank()) {
            searchPattern = "%" + search.toLowerCase().trim() + "%";
        }
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<User> userPage;

        userPage = userRepository.findByNameSearchQuery(searchPattern, pageable);

        Page<UserListItemDto> dtoPage = userPage.map(userMapper::toListItemDto);
        return userMapper.toUserListPageDto(dtoPage);
    }

    @Transactional(readOnly = true)
    public UserListPageDto searchUsers(ExpertSearchRequestDto searchRequestDto) {
        List<ExpertSearchCriteriaDto> criteria = searchCriteriaBuilder.build(searchRequestDto);

        if (criteria.isEmpty()) {
            return getAllUsers(null, null, null);
        }

        SearchQuery searchQuery = searchQueryBuilder.buildQuery(
                criteria,
                searchRequestDto.getLogicalOperator()
        );

        Query query = entityManager.createNativeQuery(searchQuery.sql(), User.class);
        searchQuery.parameters().forEach(query::setParameter);

        @SuppressWarnings("unchecked")
        List<User> users = query.getResultList();

        List<UserListItemDto> userListItemDtos = users.stream()
                .map(userMapper::toListItemDto)
                .toList();

        UserListPageDto response = new UserListPageDto();
        response.setContent(userListItemDtos);
        return response;
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