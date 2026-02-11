package com.devspark.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        UserDto user = new UserDto("user-1", request.email());
        AuthResponse response = new AuthResponse("dev-token-" + System.currentTimeMillis(), user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody RegisterRequest request) {
        UserDto user = new UserDto("user-1", request.email());
        AuthResponse response = new AuthResponse("dev-token-" + System.currentTimeMillis(), user);
        return ResponseEntity.ok(response);
    }
}
