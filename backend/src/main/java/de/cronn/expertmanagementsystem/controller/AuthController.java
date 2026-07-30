package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.AuthApi;
import de.cronn.expertmanagementsystem.config.JwtService;
import de.cronn.expertmanagementsystem.model.LoginRequestDto;
import de.cronn.expertmanagementsystem.model.TokenResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController implements AuthApi {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Override
    public ResponseEntity<TokenResponseDto> authLoginPost(LoginRequestDto loginRequestDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDto.getEmail(),
                        loginRequestDto.getPassword()
                )
        );

        // Pobieramy Springowy UserDetails zamiast naszej encji User
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String token = jwtService.generateToken(userDetails);

        TokenResponseDto response = new TokenResponseDto();
        response.setAccessToken(token);

        return ResponseEntity.ok(response);
    }
}