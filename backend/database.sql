-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: praktikum
-- ------------------------------------------------------
-- Server version	8.0.33



DROP TABLE IF EXISTS `candidates`;

CREATE TABLE `candidates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `study_direction` varchar(100) DEFAULT NULL,
  `university` varchar(100) DEFAULT NULL,
  `faculty` varchar(100) DEFAULT NULL,
  `enrollment_number` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mentor_id` int DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `study_program` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollment_number` (`enrollment_number`),
  UNIQUE KEY `email` (`email`),
  KEY `mentor_id` (`mentor_id`),
  CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `diploma_status`;

CREATE TABLE `diploma_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `disposition_status` varchar(100) DEFAULT NULL,
  `theme_status` varchar(100) DEFAULT NULL,
  `candidate_id` int DEFAULT NULL,
  `mentor_id` int DEFAULT NULL,
  `disposition` varchar(100) DEFAULT NULL,
  `theme` varchar(100) DEFAULT NULL,
  `comment` varchar(100) DEFAULT NULL,
  `signed_theme` varchar(100) DEFAULT NULL,
  `progress_status` varchar(100) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`),
  KEY `mentor_id` (`mentor_id`),
  CONSTRAINT `diploma_status_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`),
  CONSTRAINT `diploma_status_ibfk_2` FOREIGN KEY (`mentor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `documents`;

CREATE TABLE `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blank_theme` varchar(100) DEFAULT NULL,
  `blank_disposition` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `faculties`;

CREATE TABLE `faculties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `university_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `university_id` (`university_id`),
  CONSTRAINT `faculties_ibfk_1` FOREIGN KEY (`university_id`) REFERENCES `universities` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `study_programs`;

CREATE TABLE `study_programs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `faculty_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `faculty_id` (`faculty_id`),
  CONSTRAINT `study_programs_ibfk_1` FOREIGN KEY (`faculty_id`) REFERENCES `faculties` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `universities`;

CREATE TABLE `universities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT NULL,
  `role` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

