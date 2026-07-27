package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.Domain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DomainRepository extends JpaRepository<Domain, Long> {

    Page<Domain> findByNameContainingIgnoreCase(String name, Pageable pageable);
}