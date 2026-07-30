package de.cronn.expertmanagementsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.cronn.expertmanagementsystem.config.SecurityConfig;
import de.cronn.expertmanagementsystem.model.*;
import de.cronn.expertmanagementsystem.service.UserService;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.endsWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(SecurityConfig.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserSkillService userSkillService;

    // endpoint classes should test unhappy paths later - after exception handling implementation
    @Nested
    @DisplayName("GET /users")
    class GetUsersTests {

        @Test
        void shouldReturn200AndUserListPage() throws Exception {
            // given
            UserListPageDto pageDto = new UserListPageDto();
            when(userService.getAllUsers(null, 0, 10)).thenReturn(pageDto);

            // when & then
            mockMvc.perform(get("/users")
                            .param("page", "0")
                            .param("size", "10"))
                    .andExpect(status().isOk());

            verify(userService).getAllUsers(null, 0, 10);
        }
    }

    @Nested
    @DisplayName("GET /users/{id}")
    class GetUserByIdTests {

        @Test
        void shouldReturn200AndUserWhenUserExists() throws Exception {
            // given
            Integer userId = 1;
            UserDto userDto = new UserDto();
            userDto.setFirstName("Jan");

            when(userService.getUserById(userId.longValue())).thenReturn(userDto);

            // when & then
            mockMvc.perform(get("/users/{id}", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Jan"));
        }
    }

    @Nested
    @DisplayName("POST /users")
    class CreateUserTests {

        @Test
        void shouldReturn201AndLocationHeaderWhenUserIsCreated() throws Exception {
            // given
            UserRequestDto requestDto = new UserRequestDto();
            requestDto.setFirstName("Jan");
            requestDto.setLastName("Kowalski");
            requestDto.setEmail("email@email");
            requestDto.setActive(true);

            UserDto createdUserDto = new UserDto();
            createdUserDto.setId(67);
            createdUserDto.setFirstName("Jan");
            createdUserDto.setLastName("Kowalski");
            createdUserDto.setEmail("email@email");
            createdUserDto.setActive(true);

            when(userService.createUser(any(UserRequestDto.class))).thenReturn(createdUserDto);

            // when & then
            mockMvc.perform(post("/users")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isCreated())
                    // checks if header points to correct location uri
                    .andExpect(header().string("Location", endsWith("/users/67")))
                    .andExpect(jsonPath("$.id").value(67))
                    .andExpect(jsonPath("$.firstName").value("Jan"));
        }
    }

    @Nested
    @DisplayName("PUT /users/{id}")
    class UpdateUserTests {

        @Test
        void shouldReturn200WhenUserIsUpdated() throws Exception {
            // given
            Integer userId = 1;
            UserRequestDto requestDto = new UserRequestDto();
            requestDto.setFirstName("Piotr");
            requestDto.setLastName("Pawel");
            requestDto.setEmail("pp@mail.com");
            requestDto.setActive(false);

            UserDto updatedUserDto = new UserDto();
            updatedUserDto.setId(userId);
            updatedUserDto.setFirstName("Piotr");
            updatedUserDto.setLastName("Pawel");
            updatedUserDto.setEmail("pp@mail.com");
            updatedUserDto.setActive(false);

            when(userService.updateUser(eq(userId.longValue()), any(UserRequestDto.class)))
                    .thenReturn(updatedUserDto);

            // when & then
            mockMvc.perform(put("/users/{id}", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.firstName").value("Piotr"));
        }
    }

    @Nested
    @DisplayName("DELETE /users/{id}")
    class DeleteUserTests {

        @Test
        void shouldCallDeleteOnServiceWhenDeleteUserIsCalled() throws Exception {
            // given
            Integer userId = 1;

            // when & then
            mockMvc.perform(delete("/users/{id}", userId));

            verify(userService).deleteUser(userId.longValue()); // weird int-long typing again
        }
    }

    @Nested
    @DisplayName("GET /users/{userId}/skills")
    class GetUserSkillsTests {

        @Test
        void shouldReturn200AndListOfSkills() throws Exception {
            // given
            Integer userId = 1;
            UserSkillDetailDto skillDto = new UserSkillDetailDto();
            skillDto.setDomainName("Java");
            skillDto.setLevelName("Professional");
            skillDto.setRankValue(3);

            when(userSkillService.getUserSkills(userId.longValue())).thenReturn(List.of(skillDto));

            // when & then
            mockMvc.perform(get("/users/{userId}/skills", userId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$[0].domainName").value("Java"))
                    .andExpect(jsonPath("$[0].levelName").value("Professional"))
                    .andExpect(jsonPath("$[0].rankValue").value(3));

            verify(userSkillService).getUserSkills(userId.longValue());
        }
    }

    @Nested
    @DisplayName("POST /users/{userId}/skills")
    class CreateUserSkillTests {

        @Test
        void shouldReturn204WhenSkillIsAssigned() throws Exception {
            // given
            Integer userId = 1;
            UserSkillRequestDto requestDto = new UserSkillRequestDto();
            requestDto.setDomainId(1);
            requestDto.setExpertiseLevelId(2);

            // when & then
            mockMvc.perform(post("/users/{userId}/skills", userId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isNoContent());

            verify(userSkillService).createUserSkill(eq(userId.longValue()), any(UserSkillRequestDto.class));
        }
    }
}