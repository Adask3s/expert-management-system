package de.cronn.expertmanagementsystem.service;

import de.cronn.expertmanagementsystem.entity.Domain;
import de.cronn.expertmanagementsystem.repository.DomainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DomainService {

    private final DomainRepository domainRepository;

    public DomainService(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    public List<Domain> getAllDomains() {
        return domainRepository.findAll();
    }

    public Domain createDomain(Domain domain) {
        return domainRepository.save(domain);
    }

    public void deleteDomain(Long id) {
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