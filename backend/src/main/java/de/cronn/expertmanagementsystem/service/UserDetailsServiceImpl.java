package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final DatabaseCredentialsProvider credentialsProvider;

    public UserDetailsServiceImpl(UserRepository userRepository, DatabaseCredentialsProvider credentialsProvider) {
        this.userRepository = userRepository;
        this.credentialsProvider = credentialsProvider;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Nie znaleziono użytkownika o emailu: " + email));
        String password = credentialsProvider.getPassword(email);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
                .collect(Collectors.toList());

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                password,
                user.isActive(),
                true,
                true,
                true,
                authorities
        );
    }
}