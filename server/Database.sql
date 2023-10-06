CREATE DATABASE IF NOT EXISTS THRIVE_DB;

USE THRIVE_DB;

CREATE TABLE `user` (
  `user_id` int PRIMARY KEY,
  `username` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
   `account_type` varchar(255) NOT NULL ,
  `password` varchar(255) NOT NULL,
  `ProfilePic` varchar(255) ,
   `CoverPic` varchar(255)
);

CREATE TABLE `location` (
  `location_id` int PRIMARY KEY,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL
);

CREATE TABLE `person` (
  `person_id` int PRIMARY KEY,
  `user_id` int UNIQUE NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `location_id` int NOT NULL
);

CREATE TABLE `organization` (
  `organization_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `industry` varchar(255) NOT NULL,
  `location_id` int NOT NULL,
  `description` text NOT NULL,
  `website_url` varchar(255),
  `contact` varchar(255)
);

CREATE TABLE `institute` (
  `institute_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `institute_type` varchar(255) NOT NULL,
  `location_id` int NOT NULL,
  `description` text NOT NULL,
  `website_url` varchar(255),
  `contact` varchar(255)
);

CREATE TABLE `education` (
  `education_id` int PRIMARY KEY,
  `person_id` int NOT NULL,
  `institute_id` int NOT NULL,
  `year_enrolled` int NOT NULL,
  `year_graduated` int NOT NULL,
  `major` varchar(255) NOT NULL,
  `currently_studying` bool,
  `text_description` varchar(255)
);

CREATE TABLE `employment` (
  `employment_id` int PRIMARY KEY,
  `person_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `month_started` int NOT NULL,
  `year_started` int NOT NULL,
  `month_left` int NOT NULL,
  `year_left` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `text_description` varchar(255)
);

CREATE TABLE `certifications` (
  `certification_id` int PRIMARY KEY,
  `person_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `issuing_organization` varchar(255) NOT NULL,
  `issue_date` date NOT NULL,
  `expiration_date` date NOT NULL
);

CREATE TABLE `posts` (
  `post_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255),
  `post_date` datetime NOT NULL
);

CREATE TABLE `likes` (
  `like_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `like_date` datetime NOT NULL
);

CREATE TABLE `comments` (
  `comment_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `content` text NOT NULL,
  `comment_date` datetime NOT NULL
);

CREATE TABLE `communities` (
  `community_id` int PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_by` int NOT NULL,
  `creation_date` datetime NOT NULL
);

CREATE TABLE `community_members` (
  `membership_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `community_id` int NOT NULL,
  `join_date` datetime NOT NULL
);

CREATE TABLE `community_posts` (
  `community_post_id` int PRIMARY KEY,
  `community_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255),
  `post_date` datetime NOT NULL
);

CREATE TABLE `jobs` (
  `job_id` int PRIMARY KEY,
  `organization_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `requirements` text NOT NULL,
  `post_date` datetime NOT NULL,
  `expiry_date` datetime NOT NULL,
  `is_active` bool NOT NULL
);

CREATE TABLE `job_applications` (
  `application_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `application_date` datetime NOT NULL
);

CREATE TABLE `notifications` (
  `notification_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `notification_date` datetime NOT NULL,
  `is_read` bool NOT NULL
);

CREATE TABLE `video_calls` (
  `call_id` int PRIMARY KEY,
  `caller_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `call_start_time` datetime NOT NULL,
  `call_end_time` datetime NOT NULL
);

CREATE TABLE `friends` (
  `friendship_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `friendship_date` datetime NOT NULL
);

CREATE TABLE `project` (
  `project_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `skills_used` varchar(255) NOT NULL
);

CREATE TABLE `community_moderators` (
  `moderator_id` int PRIMARY KEY,
  `user_id` int NOT NULL,
  `community_id` int NOT NULL,
  `admin` bool NOT NULL
);

CREATE TABLE `chat_conversations` (
  `conversation_id` int PRIMARY KEY,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `last_message` text
);

CREATE TABLE `messages` (
  `message_id` int PRIMARY KEY,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `message_date` datetime NOT NULL,
  `is_read` bool NOT NULL
);

CREATE TABLE `audio_calls` (
  `call_id` int PRIMARY KEY,
  `caller_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `call_start_time` datetime NOT NULL,
  `call_end_time` datetime NOT NULL
);

ALTER TABLE `person` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `person` ADD FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

ALTER TABLE `organization` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `organization` ADD FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

ALTER TABLE `institute` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `institute` ADD FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`);

ALTER TABLE `education` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`);

ALTER TABLE `education` ADD FOREIGN KEY (`institute_id`) REFERENCES `institute` (`institute_id`);

ALTER TABLE `employment` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`);

ALTER TABLE `employment` ADD FOREIGN KEY (`organization_id`) REFERENCES `institute` (`institute_id`);

ALTER TABLE `certifications` ADD FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`);

ALTER TABLE `posts` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `likes` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `comments` ADD FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`);

ALTER TABLE `communities` ADD FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_members` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_members` ADD FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `jobs` ADD FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`);

ALTER TABLE `job_applications` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `job_applications` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `video_calls` ADD FOREIGN KEY (`caller_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `video_calls` ADD FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `friends` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `friends` ADD FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `project` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_moderators` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_moderators` ADD FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`);

ALTER TABLE `chat_conversations` ADD FOREIGN KEY (`user1_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `chat_conversations` ADD FOREIGN KEY (`user2_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations` (`conversation_id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `messages` ADD FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `audio_calls` ADD FOREIGN KEY (`caller_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `audio_calls` ADD FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`);
