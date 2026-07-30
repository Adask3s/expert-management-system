package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.UserCredentials;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserCredentialsRepository extends JpaRepository<UserCredentials, Long> {
    Optional<UserCredentials> findByEmail(String email);

    void deleteByEmail(String email);
}