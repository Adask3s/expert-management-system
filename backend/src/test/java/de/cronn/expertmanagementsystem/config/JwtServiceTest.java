package de.cronn.expertmanagementsystem.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();

        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);
        userDetails = new User("admin@expert.com", "password", new ArrayList<>());
    }

    @Test
    void shouldGenerateTokenAndExtractUsername() {
        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        String extractedUsername = jwtService.extractUsername(token);
        assertEquals("admin@expert.com", extractedUsername);
    }

    @Test
    void shouldValidateCorrectToken() {
        String token = jwtService.generateToken(userDetails);

        boolean isValid = jwtService.isTokenValid(token, userDetails);

        assertTrue(isValid);
    }

    @Test
    void shouldRejectTokenForDifferentUser() {
        String token = jwtService.generateToken(userDetails);
        UserDetails differentUser = new User("hacker@expert.com", "password", new ArrayList<>());

        boolean isValid = jwtService.isTokenValid(token, differentUser);

        assertFalse(isValid);
    }
}
