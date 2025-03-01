package com.example.auth.repository;

import com.example.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username); //Custom query to find a user by email
    boolean existsByUsername(String username);
    boolean existsByUsernameAndPassword(String username, String password);
}
