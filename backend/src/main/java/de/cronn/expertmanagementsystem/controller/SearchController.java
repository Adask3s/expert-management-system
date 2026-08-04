package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.SearchApi;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto;
import de.cronn.expertmanagementsystem.model.UserListPageDto;
import de.cronn.expertmanagementsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class SearchController implements SearchApi {
    private final UserService userService;

    // paging in this endpoint can be done later
    @Override
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserListPageDto> searchPost(ExpertSearchRequestDto expertSearchRequestDto) {
        UserListPageDto userListPageDto = userService.searchUsers(expertSearchRequestDto);
        return ResponseEntity.ok(userListPageDto);
    }
}
