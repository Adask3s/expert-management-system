package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.config.CustomUserDetails;
import de.cronn.expertmanagementsystem.config.JwtService;
import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.repository.UserSkillRepository;
import de.cronn.expertmanagementsystem.service.DatabaseCredentialsProvider;
import de.cronn.expertmanagementsystem.service.DomainService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class DomainControllerSecurityTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DomainService domainService;

    @MockitoBean
    private UserSkillRepository skillRepository;

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

        when(skillRepository.existsByDomainId(anyLong())).thenReturn(false);
    }

    private static Stream<Arguments> endpointTestCases() {
        String validDomainBody = "{\"name\":\"domain\",\"description\":\"an example domain\"}";

        return Stream.of(
                Arguments.of("ADMIN", "GET /domains", "admin-token", get("/domains"), 200),
                Arguments.of("USER", "GET /domains", "user-token", get("/domains"), 200),

                Arguments.of("ADMIN", "DELETE /domains/{id}", "admin-token", delete("/domains/1"), 204),
                Arguments.of("USER", "DELETE /domains/{id}", "user-token", delete("/domains/1"), 403),

                Arguments.of("ADMIN", "PUT /domains/{id}", "admin-token", put("/domains/1").contentType(MediaType.APPLICATION_JSON).content(validDomainBody), 200),
                Arguments.of("USER", "PUT /domains/{id}", "user-token", put("/domains/1").contentType(MediaType.APPLICATION_JSON).content(validDomainBody), 403),

                Arguments.of("ADMIN", "POST /domains", "admin-token", post("/domains").contentType(MediaType.APPLICATION_JSON).content(validDomainBody), 201),
                Arguments.of("USER", "POST /domains", "user-token", post("/domains").contentType(MediaType.APPLICATION_JSON).content(validDomainBody), 403)
        );
    }

    @ParameterizedTest(name = "[{index}] {0} {1} -> expected: {4}")
    @MethodSource("endpointTestCases")
    void testAllEndpointsWithRoles(String roleName, String desc, String token, MockHttpServletRequestBuilder requestBuilder, int expectedStatus) throws Exception {
        when(domainService.getDomains(any(), anyInt(), anyInt())).thenReturn(Page.empty());
        when(domainService.updateDomain(any(), any())).thenReturn(new Domain());
        when(domainService.createDomain(any())).thenReturn(new Domain());

        mockMvc.perform(requestBuilder
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().is(expectedStatus));
    }
}
