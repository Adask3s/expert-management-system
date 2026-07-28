package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.ExpertiseLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpertiseLevelRepository extends JpaRepository<ExpertiseLevel, Integer> {

}
