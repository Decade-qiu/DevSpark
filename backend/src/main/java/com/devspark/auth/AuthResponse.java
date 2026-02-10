package com.devspark.auth;

public record AuthResponse(String token, UserDto user) {
}
