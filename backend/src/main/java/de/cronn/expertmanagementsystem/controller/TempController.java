package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.AuthApi;
import de.cronn.expertmanagementsystem.model.LoginRequestDto;
import de.cronn.expertmanagementsystem.model.TokenResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TempController implements AuthApi {
    @Override
    public ResponseEntity<TokenResponseDto> authLoginPost(LoginRequestDto loginRequestDto) {
        return null;
    }
}
