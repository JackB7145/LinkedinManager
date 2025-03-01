package com.example.auth.controllers;

import com.example.auth.model.Profiles;
import com.example.auth.repository.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.auth.model.User;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthHelper authHelper;

    private final ProfilesRepository profilesRepository;

    @Autowired
    public AuthController(AuthHelper authHelper, ProfilesRepository profilesRepository) {
        this.profilesRepository = profilesRepository;
        this.authHelper = authHelper;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        int result = authHelper.addDBCredentials(user.getUsername(), user.getPassword());

        if (result == 1) {
            return "User registered successfully!";
        }
        return "Failed to register user.";
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        boolean isAuthenticated = authHelper.queryDBCredentials(user.getUsername(), user.getPassword());
        return isAuthenticated ? "Login successful!" : "Invalid credentials!";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/returnAccessToken")
    public String returnAccess() {
        return "Access token functionality coming soon!";
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/isUserAuth")
    public String verifyAccessToken() {
        return "Access token verification coming soon!";
    }
}
