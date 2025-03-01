package com.example.auth.controllers;

import com.example.auth.model.Profiles;
import com.example.auth.repository.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.auth.model.User;

//Rest controller used for all endpoints and links to corresponding controllers
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthHelper authHelper;
    private final ProfilesRepository profilesRepository;

    //Retrieving all relevant controllers
    @Autowired
    public AuthController(AuthHelper authHelper, ProfilesRepository profilesRepository) {
        this.profilesRepository = profilesRepository;
        this.authHelper = authHelper;
    }

    //Cors and register endpoint
    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        int result = authHelper.addDBCredentials(user.getUsername(), user.getPassword());

        if (result == 1) {
            return "User registered successfully!";
        }
        return "Failed to register user.";
    }

    //Cors and login endpoint
    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        boolean isAuthenticated = authHelper.queryDBCredentials(user.getUsername(), user.getPassword());
        return isAuthenticated ? "Login successful!" : "Invalid credentials!";
    }

    //Cors and potential spring security update
    @CrossOrigin(origins = "*")
    @GetMapping("/returnAccessToken")
    public String returnAccess() {
        return "Access token functionality coming soon!";
    }

    //Cors and potential spring security update
    @CrossOrigin(origins = "*")
    @GetMapping("/isUserAuth")
    public String verifyAccessToken() {
        return "Access token verification coming soon!";
    }
}
