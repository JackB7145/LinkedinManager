package com.example.auth.controllers;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Bean;

@Builder
@Getter
@Setter
public class username {
    public String username;

    public username(String username) {
        this.username = username;
    }

    public String getUsername() {
        return this.username;
    }

}
