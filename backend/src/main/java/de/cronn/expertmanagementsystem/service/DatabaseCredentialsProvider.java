package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.UserCredentials;
import de.cronn.expertmanagementsystem.repository.UserCredentialsRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DatabaseCredentialsProvider {

    private final UserCredentialsRepository repository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseCredentialsProvider(UserCredentialsRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createDefaultCredentials(String email) {
        String encodedPassword = passwordEncoder.encode("Start123!");
        repository.save(new UserCredentials(email, encodedPassword));
    }

    public String getPassword(String email) {
        return repository.findByEmail(email)
                .map(UserCredentials::getPassword)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono poświadczeń dla użytkownika: " + email));
    }

    @Transactional
    public void deleteCredentials(String email) {
        repository.deleteByEmail(email);
    }
}