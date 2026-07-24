package de.cronn.expertmanagementsystem.repository;

import de.cronn.expertmanagementsystem.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
