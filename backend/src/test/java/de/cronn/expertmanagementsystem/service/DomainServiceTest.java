package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.repository.DomainRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
    @InjectMocks
    private DomainService domainService;

    @Test
    void shouldReturnAllDomains() {
        Domain domain1 = new Domain();
        domain1.setId(1L);
        domain1.setName("Backend");

        Domain domain2 = new Domain();
        domain2.setId(2L);
        domain2.setName("Frontend");

        when(domainRepository.findAll()).thenReturn(List.of(domain1, domain2));

        List<Domain> result = domainService.getAllDomains();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Backend");
        assertThat(result.get(1).getName()).isEqualTo("Frontend");
        verify(domainRepository, times(1)).findAll();
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

        domainService.deleteDomain(idToDelete);

        verify(domainRepository, times(1)).deleteById(idToDelete);
    }
}