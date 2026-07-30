package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.config.CustomUserDetails;
import de.cronn.expertmanagementsystem.config.JwtService;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.model.UserDto;
import de.cronn.expertmanagementsystem.model.UserListPageDto;
import de.cronn.expertmanagementsystem.service.DatabaseCredentialsProvider;
import de.cronn.expertmanagementsystem.service.UserService;
import de.cronn.expertmanagementsystem.service.UserSkillService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.List;
import java.util.stream.Stream;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private UserSkillService userSkillService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private DatabaseCredentialsProvider credentialsProvider;

    @BeforeEach
    void setUp() {
        User adminUser = new User();
        adminUser.setId(1L);
        UserDetails adminDetails = new CustomUserDetails(
                adminUser,
                "password",
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        User regularUser = new User();
        regularUser.setId(2L);
        UserDetails regularDetails = new CustomUserDetails(
                regularUser,
                "password",
                List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER"))
        );

        when(jwtService.extractUsername("admin-token")).thenReturn("admin@test.com");
        when(jwtService.extractUsername("user-token")).thenReturn("user@test.com");

        when(jwtService.isTokenValid(eq("admin-token"), any())).thenReturn(true);
        when(jwtService.isTokenValid(eq("user-token"), any())).thenReturn(true);

        when(userDetailsService.loadUserByUsername("admin@test.com")).thenReturn(adminDetails);
        when(userDetailsService.loadUserByUsername("user@test.com")).thenReturn(regularDetails);
    }

    private static Stream<Arguments> endpointTestCases() {
        String validUserBody = "{\"firstName\":\"Jan\",\"lastName\":\"Kowalski\",\"email\":\"test@test.com\",\"active\":true}";

        return Stream.of(
                Arguments.of("ADMIN", "GET /users", "admin-token", get("/users"), 200),
                Arguments.of("USER", "GET /users", "user-token", get("/users"), 200),

                Arguments.of("ADMIN", "DELETE /users/{id} (as owner)", "admin-token", delete("/users/1"), 204),
                Arguments.of("USER", "DELETE /users/{id} (not owner)", "user-token", delete("/users/1"), 403),

                Arguments.of("ADMIN", "GET /users/{id} (as owner)", "admin-token", get("/users/1"), 200),
                Arguments.of("USER", "GET /users/{id} (not owner)", "user-token", get("/users/1"), 200),

                Arguments.of("ADMIN", "PUT /users/{id} (as owner)", "admin-token", put("/users/1").contentType(MediaType.APPLICATION_JSON).content(validUserBody), 200),
                Arguments.of("USER", "PUT /users/{id} (not owner)", "user-token", put("/users/1").contentType(MediaType.APPLICATION_JSON).content(validUserBody), 403),

                Arguments.of("USER", "PUT /users/{id} (as owner)", "user-token", put("/users/2").contentType(MediaType.APPLICATION_JSON).content(validUserBody), 200),

                Arguments.of("ADMIN", "POST /users", "admin-token", post("/users").contentType(MediaType.APPLICATION_JSON).content(validUserBody), 201),
                Arguments.of("USER", "POST /users", "user-token", post("/users").contentType(MediaType.APPLICATION_JSON).content(validUserBody), 403),

                Arguments.of("ADMIN", "POST /users/{id}/roles (as owner)", "admin-token", post("/users/1/roles").contentType(MediaType.APPLICATION_JSON).content("{\"roleName\":\"ADMIN\"}"), 201),
                Arguments.of("USER", "POST /users/{id}/roles (not owner)", "user-token", post("/users/1/roles").contentType(MediaType.APPLICATION_JSON).content("{\"roleName\":\"ADMIN\"}"), 403),

                Arguments.of("ADMIN", "DELETE /users/{id}/roles/ADMIN (as owner)", "admin-token", delete("/users/1/roles/ADMIN"), 204),
                Arguments.of("USER", "DELETE /users/{id}/roles/ADMIN (not owner)", "user-token", delete("/users/1/roles/ADMIN"), 403),

                Arguments.of("USER", "GET /users/{id}/skills (as owner)", "user-token", get("/users/2/skills"), 200),

                Arguments.of("USER", "GET /users/{id}/skills (not owner)", "user-token", get("/users/1/skills"), 403),
                Arguments.of("ADMIN", "GET /users/{id}/skills (as owner)", "admin-token", get("/users/1/skills"), 200)
        );
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> expected: {4}")
    @MethodSource("endpointTestCases")
    void testAllEndpointsWithRoles(String roleName, String desc, String token, MockHttpServletRequestBuilder requestBuilder, int expectedStatus) throws Exception {
        when(userService.getAllUsers(any(), any(), any())).thenReturn(new UserListPageDto());
        when(userService.getUserById(any())).thenReturn(new UserDto());
        when(userService.updateUser(any(), any())).thenReturn(new UserDto());
        when(userService.createUser(any())).thenReturn(new UserDto());
        when(userSkillService.getUserSkills(any())).thenReturn(List.of());

        mockMvc.perform(requestBuilder
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().is(expectedStatus));
    }
}