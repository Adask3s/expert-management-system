package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.repository.DomainRepository;
import de.cronn.expertmanagementsystem.repository.UserSkillRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DomainServiceTest {

    @Mock
    private DomainRepository domainRepository;
    @Mock
    private UserSkillRepository skillRepository;
    @InjectMocks
    private DomainService domainService;

    @Test
    void shouldReturnDomainsPage() {
        Domain domain = new Domain();
        domain.setId(1L);
        domain.setName("Backend");

        Page<Domain> page = new PageImpl<>(List.of(domain));

        when(domainRepository.findAll(any(Pageable.class)))
                .thenReturn(page);

        Page<Domain> result = domainService.getDomains(null, 0, 10);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().getFirst().getName()).isEqualTo("Backend");
        verify(domainRepository, times(1))
                .findAll(any(Pageable.class));
    }

    @Test
    void shouldCreateDomainSuccessfully() {
        Domain inputDomain = new Domain();
        inputDomain.setName("DevOps");

        Domain savedDomain = new Domain();
        savedDomain.setId(1L);
        savedDomain.setName("DevOps");

        when(domainRepository.save(any(Domain.class))).thenReturn(savedDomain);

        Domain result = domainService.createDomain(inputDomain);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("DevOps");
        verify(domainRepository, times(1)).save(inputDomain);
    }

    @Test
    void shouldUpdateDomainSuccessfully() {
        Long idToUpdate = 1L;

        Domain existingDomain = new Domain();
        existingDomain.setId(idToUpdate);
        existingDomain.setName("Stara Nazwa");

        Domain updatedData = new Domain();
        updatedData.setName("Nowa Nazwa");
        updatedData.setDescription("Nowy opis");

        when(domainRepository.findById(idToUpdate)).thenReturn(Optional.of(existingDomain));
        when(domainRepository.save(any(Domain.class))).thenAnswer(i -> i.getArgument(0));

        Domain result = domainService.updateDomain(idToUpdate, updatedData);

        assertThat(result.getName()).isEqualTo("Nowa Nazwa");
        assertThat(result.getDescription()).isEqualTo("Nowy opis");
        verify(domainRepository, times(1)).findById(idToUpdate);
        verify(domainRepository, times(1)).save(existingDomain);
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistingDomain() {
        Long idToUpdate = 999L;
        Domain updatedData = new Domain();
        updatedData.setName("Nowa Nazwa");

        when(domainRepository.findById(idToUpdate)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> domainService.updateDomain(idToUpdate, updatedData))
                .isInstanceOf(RuntimeException.class);
        verify(domainRepository, never()).save(any());
    }

    @Test
    void shouldDeleteDomainWhenExists() {
        Long idToDelete = 1L;
        when(domainRepository.existsById(idToDelete)).thenReturn(true);
        when(skillRepository.existsByDomainId(anyLong())).thenReturn(false);
        domainService.deleteDomain(idToDelete);

        verify(domainRepository, times(1)).deleteById(idToDelete);
    }
}