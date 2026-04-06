/* package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}  



package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ✅ ADD THESE IMPORTS
import org.springframework.context.annotation.Bean;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	// ✅ ADD THIS METHOD
	@Bean
	public MongoClient mongoClient() {
		return MongoClients.create("mongodb+srv://admin:Senumi%4018@cluster0.bvpcwu4.mongodb.net/test");
	}
} 

package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}
}  */

	
package com.smartcampus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.example.server.UserRepository;
import com.smartcampus.user.User;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class ServerApplication {

    @Autowired
    private UserRepository repo;

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }

    @PostConstruct
    public void insertData() {
        repo.save(new User("Diyana"));
        System.out.println("Data inserted!");
    }
}