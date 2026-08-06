package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Integer> {
    List<UserSkill> findByUserId(Long userId);

    List<UserSkill> findByDomainId(Long domainId);

    boolean existsByUserIdAndDomainId(Long userId, Long domainId);

    boolean existsByDomainId(Long domainId);

    void deleteByDomainId(Long domainId);
}
