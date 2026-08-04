package de.cronn.expertmanagementsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.expertmanagementsystem.model.ExpertSearchCriteriaDto;
import de.cronn.expertmanagementsystem.model.ExpertSearchRequestDto;
import de.cronn.expertmanagementsystem.model.UserListPageDto;
import de.cronn.expertmanagementsystem.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class SearchControllerTest {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    UserService userService;

    @InjectMocks
    SearchController searchController;

    @DisplayName("POST /search")
    @Test
    void shouldReturn200AndMatchingUsers_whenValidSearchRequest() throws Exception {
        // given
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(searchController).build();

        ExpertSearchRequestDto requestDto = new ExpertSearchRequestDto();
        ExpertSearchCriteriaDto criteriaDto = new ExpertSearchCriteriaDto("SQL", 3);
        requestDto.setCriteria(List.of(criteriaDto));
        requestDto.setLogicalOperator(ExpertSearchRequestDto.LogicalOperatorEnum.OR);

        UserListPageDto expectedPageDto = new UserListPageDto();
        when(userService.searchUsers(any(ExpertSearchRequestDto.class))).thenReturn(expectedPageDto);

        // when & then
        mockMvc.perform(post("/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk());

        verify(userService).searchUsers(any(ExpertSearchRequestDto.class));
    }
}
