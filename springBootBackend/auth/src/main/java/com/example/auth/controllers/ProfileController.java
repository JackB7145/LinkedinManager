package com.example.auth.controllers;

import com.example.auth.model.Profiles;
import com.example.auth.repository.ProfilesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//Rest endpoints associated with profile operations
@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfilesRepository profilesRepository;

    //Retrieving the profiles repository
    @Autowired
    public ProfileController(ProfilesRepository profilesRepository) {
        this.profilesRepository = profilesRepository;
    }

    //Cors and endpoint for getting profiles
    @CrossOrigin(origins = "*")
    @PostMapping("/getProfiles")
    public List<Profiles> getProfiles(@RequestBody username username) {
        System.out.println("Fetching profiles for username: " + username); // Add logging
        System.out.println("Check1");
        System.out.println(username);
        if (profilesRepository.existsByUsername(username.getUsername())) {
            System.out.println("Check2");
            List<Profiles> myProfiles = profilesRepository.findAllByUsername(username.getUsername()); //Stores all profiles associated with the provides username
            System.out.println("Profiles found: " + myProfiles.size()); // Add logging

            return myProfiles; //Returning the list of profiles
        } else {
            return null;
        }
    }

    //Cors and endpoint for adding db credentials
    @CrossOrigin(origins = "*")
    @PostMapping("/addProfile")
    public String addProfile(@RequestBody Profiles newProfile) {
        profilesRepository.save(newProfile); //Saving the model
        return "Added Profile";
    }
}
