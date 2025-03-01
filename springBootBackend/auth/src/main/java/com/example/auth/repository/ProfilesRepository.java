package com.example.auth.repository;

import com.example.auth.model.Profiles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfilesRepository extends JpaRepository<Profiles, Long> {
    Profiles findByUsername(String username); // Custom query to find a user by email
    boolean existsByUsername(String username);
    List<Profiles> findAllByUsername(String username);
}
