package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.config.CustomUserDetails;
import de.cronn.expertmanagementsystem.config.JwtService;
import de.cronn.expertmanagementsystem.config.SkillSecurityBean;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.service.DatabaseCredentialsProvider;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserSkillControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserSkillService userSkillService;

    @MockitoBean
    private SkillSecurityBean skillSecurity;

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
        String validSkillBody = "{\"userId\":1,\"domainId\":1,\"expertiseLevelId\":1}";

        return Stream.of(
                Arguments.of("ADMIN", "DELETE /user-skills/{id}", "admin-token", delete("/user-skills/1"), 204),
                Arguments.of("ADMIN", "PUT /user-skills/{id}", "admin-token", put("/user-skills/1").contentType(MediaType.APPLICATION_JSON).content(validSkillBody), 200),

                Arguments.of("USER", "DELETE /user-skills/{id} (as owner)", "user-token", delete("/user-skills/1"), 204),
                Arguments.of("USER", "PUT /user-skills/{id} (as owner)", "user-token", put("/user-skills/1").contentType(MediaType.APPLICATION_JSON).content(validSkillBody), 200),

                Arguments.of("USER", "DELETE /user-skills/{id} (not owner)", "user-token", delete("/user-skills/99"), 403),
                Arguments.of("USER", "PUT /user-skills/{id} (not owner)", "user-token", put("/user-skills/99").contentType(MediaType.APPLICATION_JSON).content(validSkillBody), 403)
        );
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> expected: {4}")
    @MethodSource("endpointTestCases")
    void testAllEndpointsWithRoles(String roleName, String desc, String token, MockHttpServletRequestBuilder requestBuilder, int expectedStatus) throws Exception {
        when(skillSecurity.isOwner(eq(1L), anyLong())).thenReturn(true);
        when(skillSecurity.isOwner(eq(99L), anyLong())).thenReturn(false);

        mockMvc.perform(requestBuilder
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().is(expectedStatus));
    }
}