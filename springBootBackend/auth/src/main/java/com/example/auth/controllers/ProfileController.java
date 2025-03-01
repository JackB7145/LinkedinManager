package com.example.auth.controllers;

import com.example.auth.model.Profiles;
import com.example.auth.repository.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfilesRepository profilesRepository;

    @Autowired
    public ProfileController(ProfilesRepository profilesRepository) {
        this.profilesRepository = profilesRepository;
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/getProfiles")
    public List<Profiles> getProfiles(@RequestBody username username) {
        System.out.println("Fetching profiles for username: " + username); // Add logging
        System.out.println("Check1");
        System.out.println(username);
        if (profilesRepository.existsByUsername(username.getUsername())) {
            System.out.println("Check2");
            List<Profiles> myProfiles = profilesRepository.findAllByUsername(username.getUsername());
            System.out.println("Profiles found: " + myProfiles.size()); // Add logging

            return myProfiles;
        } else {
            return null;
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/addProfile")
    public String addProfile(@RequestBody Profiles newProfile) {
        profilesRepository.save(newProfile);
        return "Added Profile";
    }
}
