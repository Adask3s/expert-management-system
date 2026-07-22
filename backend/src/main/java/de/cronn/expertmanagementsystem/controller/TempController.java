package de.cronn.expertmanagementsystem.controller;

import de.cronn.expertmanagementsystem.api.AuthApi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

// if cannot resolve .api package run maven clean compile
// this creates interfaces from openapi plugin
@RestController
public class TempController implements AuthApi {
    @Override
    public ResponseEntity<Void> authLoginPost() {
        return null;
    }
}
