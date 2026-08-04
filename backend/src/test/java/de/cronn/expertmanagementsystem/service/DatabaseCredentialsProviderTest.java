package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.UserCredentials;
import de.cronn.expertmanagementsystem.repository.UserCredentialsRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DatabaseCredentialsProviderTest {

    @Mock
    private UserCredentialsRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DatabaseCredentialsProvider provider;

    private static final String TEST_EMAIL = "user@example.com";
    private static final String TEST_PASSWORD = "Start123!";

    @Nested
    @DisplayName("createDefaultCredentials")
    class CreateDefaultCredentialsTests {

        @Test
        void shouldEncodePasswordAndSaveUserCredentials() {
            // given
            when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn("encodedPassword");

            // when
            provider.createDefaultCredentials(TEST_EMAIL);
            ArgumentCaptor<UserCredentials> captor = ArgumentCaptor.forClass(UserCredentials.class);

            // then
            verify(repository).save(captor.capture());

            UserCredentials savedCredentials = captor.getValue();
            assertThat(savedCredentials.getEmail()).isEqualTo(TEST_EMAIL);
            assertThat(savedCredentials.getPassword()).isEqualTo("encodedPassword");
        }
    }

    @Nested
    @DisplayName("getPassword")
    class GetPasswordTests {

        @Test
        void shouldReturnPassword_whenUserExists() {
            // given
            UserCredentials credentials = new UserCredentials(TEST_EMAIL, TEST_PASSWORD);
            when(repository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(credentials));

            // when
            String result = provider.getPassword(TEST_EMAIL);

            // then
            assertThat(result).isEqualTo(TEST_PASSWORD);
        }

        @Test
        void shouldThrowException_whenUserNotFound() {
            // given
            when(repository.findByEmail(anyString())).thenReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> provider.getPassword(TEST_EMAIL))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessageContaining("Credentials not found for user: " + TEST_EMAIL);
        }
    }

    @Nested
    @DisplayName("deleteCredentials")
    class DeleteCredentialsTests {

        @Test
        void shouldDelegateDeleteToRepository() {
            // when
            provider.deleteCredentials(TEST_EMAIL);

            // then
            verify(repository).deleteByEmail(TEST_EMAIL);
        }
    }
}