package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE :search IS NULL OR u.searchText LIKE :search")
    Page<User> findByNameSearchQuery(@Param("search") String search, Pageable pageable);
}
