package com.FestOrg.FestOrg.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.FestOrg.FestOrg.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
	Optional<User> findByUsername(String username);
    Optional<User> findByResetToken(String resetToken);
}