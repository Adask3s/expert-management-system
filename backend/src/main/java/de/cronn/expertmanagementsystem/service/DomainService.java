package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.repository.DomainRepository;
import de.cronn.expertmanagementsystem.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DomainService {

    private final DomainRepository domainRepository;

    private final UserSkillRepository skillRepository;

    public Page<Domain> getDomains(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        if (name != null && !name.isBlank()) {
            return domainRepository.findByNameContainingIgnoreCase(name, pageable);
        }

        return domainRepository.findAll(pageable);
    }

    public Domain createDomain(Domain domain) {
        return domainRepository.save(domain);
    }

    @Transactional
    public void deleteDomain(Long id) {
        if (skillRepository.existsByDomainId(id)) {
            skillRepository.deleteByDomainId(id);
        }
        if (domainRepository.existsById(id)) {
            domainRepository.deleteById(id);
        }
    }

    public Domain updateDomain(Long id, Domain updatedData) {
        return domainRepository.findById(id).map(existingDomain -> {
            existingDomain.setName(updatedData.getName());
            existingDomain.setDescription(updatedData.getDescription());
            return domainRepository.save(existingDomain);
        }).orElseThrow(() -> new RuntimeException("Nie znaleziono domeny o ID: " + id));
    }
}