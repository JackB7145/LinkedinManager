package com.example.auth.controllers;

import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

//Helper service used for aiding in database operations
@Service
public class AuthHelper {

    private final UserRepository userRepository;

    //Retrieving the user repository
    @Autowired
    public AuthHelper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //Method used for verifying if provides credentials are valid
    public boolean queryDBCredentials(String username, String password) {
        return userRepository.existsByUsernameAndPassword(username,password);
    }

    //Method used for adding database credentials
    public int addDBCredentials(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            return 0; // User already exists
        }

        User newUser = new User(username, password);
        userRepository.save(newUser);
        return 1; // Successfully added
    }
}
