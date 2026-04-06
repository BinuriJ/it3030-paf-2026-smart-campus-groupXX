package com.example.server;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.smartcampus.user.User;

public interface UserRepository extends MongoRepository<User, String> {
}
