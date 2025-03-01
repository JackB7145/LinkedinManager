package com.example.auth.controllers;

import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthHelper {

    private final UserRepository userRepository;

    @Autowired
    public AuthHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean queryDBCredentials(String username, String password) {
        return userRepository.existsByUsernameAndPassword(username,password);
    }

    public int addDBCredentials(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            return 0; // User already exists
        }

        User newUser = new User(username, password);
        userRepository.save(newUser);
        return 1; // Successfully added
    }
}
