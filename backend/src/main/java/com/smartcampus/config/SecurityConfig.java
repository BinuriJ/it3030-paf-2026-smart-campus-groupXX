package com.smartcampus.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

// SECURITY CONFIGURATION-> Configures Spring Security for the Smart Campus API

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // SECURITY FILTER CHAIN-> Defines the security rules for all incoming HTTP requests
    // cors: applies the CORS configuration defined below, csrf: disabled  & CSRF protection is only needed for session-based web apps
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            );
        return http.build();
    }

    // CORS CONFIGURATION- allows the React frontend
    // running on localhost:5173 to make API calls to Spring Boot on localhost:8080
    // allowedOrigins: only localhost:5173 (React dev server) is allowed
    // allowedMethods: GET, POST, PUT, DELETE, OPTIONS are permitted
    // allowedHeaders: all headers allowed (*)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}