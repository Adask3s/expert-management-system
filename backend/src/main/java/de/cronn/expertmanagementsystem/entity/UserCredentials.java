package de.cronn.expertmanagementsystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "user_credentials")
public class UserCredentials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public UserCredentials() {
    }

    public UserCredentials(String email, String password) {
        this.email = email;
        this.password = password;
    }

}