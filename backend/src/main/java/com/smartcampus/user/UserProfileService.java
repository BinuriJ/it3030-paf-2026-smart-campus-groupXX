package com.smartcampus.user;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.auth.dto.UserResponse;

@Service
public class UserProfileService {

    private final UserAccountRepository userRepository;

    public UserProfileService(UserAccountRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getUserById(String id) {
        AppUser user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.from(user);
    }
}
