package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.config.CustomUserDetails;
import de.cronn.expertmanagementsystem.entity.User;
import de.cronn.expertmanagementsystem.repository.UserRepository;
import org.jspecify.annotations.NullMarked;
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
    @NullMarked
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with e-mail: " + email));

        String password = credentialsProvider.getPassword(email);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        return new CustomUserDetails(user, password, authorities);
    }
}