package com.example.auth.model;

import jakarta.persistence.*;

//User model
@Entity
@Table(name = "users") // Matches your PostgreSQL table name
public class User {

    //Initializing all of the columns
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    //Constructors
    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    //Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
