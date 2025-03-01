package com.yourapp.service;

import com.example.auth.model.User;
import com.example.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

//Services related to users
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    //Save a new user
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    //Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //Find user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
