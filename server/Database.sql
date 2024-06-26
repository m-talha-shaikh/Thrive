CREATE DATABASE IF NOT EXISTS THRIVE_DB;
Select * from user;
USE THRIVE_DB;
CREATE TABLE `user` (
  `user_id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `account_type` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `ProfilePic` VARCHAR(255),
  `CoverPic` VARCHAR(255),
  `otp` VARCHAR(6),
  `otp_time` TIMESTAMP,
  `verified_user` BOOLEAN
);

CREATE TABLE `location` (
  `location_id` int PRIMARY KEY AUTO_INCREMENT,
  `city` varchar(255) NOT NULL,
  `state` varchar(255),
  `country` varchar(255) NOT NULL
);

CREATE TABLE `person` (
  `person_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int UNIQUE NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `location_id` int NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
);

CREATE TABLE `organization` (
  `organization_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `name` varchar(255) NOT NULL,
  `industry` varchar(255),
  `location_id` int,
  `description` text,
  `website_url` varchar(255),
  `contact` varchar(255),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
);

CREATE TABLE `institute` (
  `institute_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `name` varchar(255) NOT NULL,
  `institute_type` varchar(255),
  `location_id` int,
  `description` text ,
  `website_url` varchar(255),
  `contact` varchar(255),
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
);

CREATE TABLE `education` (
  `education_id` int PRIMARY KEY AUTO_INCREMENT,
  `person_id` int NOT NULL,
  `institute_id` int NOT NULL,
  `year_enrolled` int NOT NULL,
  `year_graduated` int,
  `major` varchar(255) NOT NULL,
  `currently_studying` bool,
  `text_description` varchar(255),
    FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`),
    FOREIGN KEY (`institute_id`) REFERENCES `institute` (`institute_id`)
);

CREATE TABLE `employment` (
  `employment_id` int PRIMARY KEY AUTO_INCREMENT,
  `person_id` int NOT NULL,
  `organization_id` int NOT NULL,
  `month_started` int NOT NULL,
  `year_started` int NOT NULL,
  `month_left` int,
  `year_left` int,
  `title` varchar(255) NOT NULL,
  `text_description` varchar(255),
    FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`),
    FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`)
);

CREATE TABLE `certifications` (
  `certification_id` int PRIMARY KEY AUTO_INCREMENT,
  `person_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `issuing_organization` varchar(255) NOT NULL,
  `issue_date` date,
  `expiration_date` date,
    FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`)
);

CREATE TABLE `posts` (
  `post_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `image_url` varchar(255),
  `post_date` datetime NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `likes` (
  `like_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `like_date` datetime NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
);

CREATE TABLE `comments` (
  `comment_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `content` text NOT NULL,
  `comment_date` datetime NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
);

CREATE TABLE `jobs` (
  `job_id` int PRIMARY KEY AUTO_INCREMENT,
  `organization_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `post_date` datetime NOT NULL,
  `expiry_date` datetime NOT NULL,
  `is_active` bool NOT NULL,
  `salary_min` decimal(10, 2),
  `salary_max` decimal(10, 2),
  `country` varchar(255),
  `job_type` varchar(255),
  `openings` int,
  `remote_work` bool,
    FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`)
);


CREATE TABLE `job_applications` (
  `application_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_id` int NOT NULL,
  `application_date` datetime NOT NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
    FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`)
);


CREATE TABLE `friends` (
  `friendship_id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `friendship_date` datetime NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `conversation` (
  `conversation_id` int PRIMARY KEY AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `last_message` text,
  `last_message_date` datetime,
  FOREIGN KEY (`user1_id`) REFERENCES `user` (`user_id`),
  FOREIGN KEY (`user2_id`) REFERENCES `user` (`user_id`)
);

CREATE TABLE `message` (
  `message_id` int PRIMARY KEY AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `message_content` text,
  `message_date` datetime,
  FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`conversation_id`),
  FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`)
);


ALTER TABLE jobs
ADD FULLTEXT(title, description);


ALTER TABLE organization
ADD COLUMN job_count INT DEFAULT 0;

--Trigger

DELIMITER //

CREATE TRIGGER after_insert_job
AFTER INSERT
ON jobs FOR EACH ROW
BEGIN
    -- Increment the job_count for the corresponding organization
    UPDATE organization
    SET job_count = job_count + 1
    WHERE organization_id = NEW.organization_id;
END //

DELIMITER ;

--Stored Procedure

DELIMITER //

CREATE PROCEDURE UpdatePerson(
  IN p_city VARCHAR(255),
  IN p_state VARCHAR(255),
  IN p_country VARCHAR(255),
  IN p_user_id INT,
  IN p_first_name VARCHAR(255),
  IN p_last_name VARCHAR(255),
  IN p_username VARCHAR(255),
  IN p_cover_pic VARCHAR(255),
  IN p_profile_pic VARCHAR(255)
)
BEGIN
  -- Update location
  UPDATE location
  SET
    city = p_city,
    state = p_state,
    country = p_country
  WHERE location_id = (SELECT location_id FROM person WHERE user_id = p_user_id);

  -- Update person
  UPDATE person
  SET
    first_name = p_first_name,
    last_name = p_last_name
  WHERE user_id = p_user_id;

  -- Update user
  UPDATE user
  SET
    username = p_username,
    CoverPic = p_cover_pic,
    ProfilePic = p_profile_pic
  WHERE user_id = p_user_id;

END //

DELIMITER ;


-- CREATE TABLE `friendship_requests` (
--   `request_id` int PRIMARY KEY AUTO_INCREMENT,
--   `sender_id` int NOT NULL,
--   `receiver_id` int NOT NULL,
--   `status` varchar(255) NOT NULL,
--   `request_date` datetime NOT NULL,
--   FOREIGN KEY (`sender_id`) REFERENCES `user` (`user_id`),
--   FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`)
-- );


-- CREATE TABLE `communities` (
--   `community_id` int PRIMARY KEY AUTO_INCREMENT,
--   `name` varchar(255) NOT NULL,
--   `description` text NOT NULL,
--   `created_by` int NOT NULL,
--   `creation_date` datetime NOT NULL
-- );

-- CREATE TABLE `community_members` (
--   `membership_id` int PRIMARY KEY AUTO_INCREMENT,
--   `user_id` int NOT NULL,
--   `community_id` int NOT NULL,
--   `join_date` datetime NOT NULL
-- );

-- CREATE TABLE `community_posts` (
--   `community_post_id` int PRIMARY KEY AUTO_INCREMENT,
--   `community_id` int NOT NULL,
--   `user_id` int NOT NULL,
--   `content` text NOT NULL,
--   `image_url` varchar(255),
--   `post_date` datetime NOT NULL
-- );

-- CREATE TABLE `notifications` (
--   `notification_id` int PRIMARY KEY AUTO_INCREMENT,
--   `user_id` int NOT NULL,
--   `content` text NOT NULL,
--   `notification_date` datetime NOT NULL,
--   `is_read` bool NOT NULL
-- );

-- CREATE TABLE `video_calls` (
--   `call_id` int PRIMARY KEY AUTO_INCREMENT,
--   `caller_id` int NOT NULL,
--   `receiver_id` int NOT NULL,
--   `call_start_time` datetime NOT NULL,
--   `call_end_time` datetime NOT NULL
-- );



-- CREATE TABLE `project` (
--   `project_id` int PRIMARY KEY AUTO_INCREMENT,
--   `user_id` int NOT NULL,
--   `name` varchar(255) NOT NULL,
--   `description` text NOT NULL,
--   `start_date` date NOT NULL,
--   `end_date` date NOT NULL,
--   `skills_used` varchar(255) NOT NULL
-- );

-- CREATE TABLE `community_moderators` (
--   `moderator_id` int PRIMARY KEY AUTO_INCREMENT,
--   `user_id` int NOT NULL,
--   `community_id` int NOT NULL,
--   `admin` bool NOT NULL
-- );

-- CREATE TABLE `chat_conversations` (
--   `conversation_id` int PRIMARY KEY AUTO_INCREMENT,
--   `user1_id` int NOT NULL,
--   `user2_id` int NOT NULL,
--   `last_message` text
-- );

-- CREATE TABLE `messages` (
--   `message_id` int PRIMARY KEY AUTO_INCREMENT,
--   `conversation_id` int NOT NULL,
--   `sender_id` int NOT NULL,
--   `receiver_id` int NOT NULL,
--   `content` text NOT NULL,
--   `message_date` datetime NOT NULL,
--   `is_read` bool NOT NULL
-- );

-- CREATE TABLE `audio_calls` (
--   `call_id` int PRIMARY KEY AUTO_INCREMENT,
--   `caller_id` int NOT NULL,
--   `receiver_id` int NOT NULL,
--   `call_start_time` datetime NOT NULL,
--   `call_end_time` datetime NOT NULL
-- );

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

ALTER TABLE `jobs` ADD FOREIGN KEY (`organization_id`) REFERENCES `organization` (`organization_id`);

ALTER TABLE `job_applications` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `job_applications` ADD FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`);

ALTER TABLE `friends` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `friends` ADD FOREIGN KEY (`friend_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `communities` ADD FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_members` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `community_members` ADD FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`);

ALTER TABLE `community_posts` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `video_calls` ADD FOREIGN KEY (`caller_id`) REFERENCES `user` (`user_id`);

ALTER TABLE `video_calls` ADD FOREIGN KEY (`receiver_id`) REFERENCES `user` (`user_id`);

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



-- Allow user_id, industry, location_sid, description, website_url, and contact to be NULL
ALTER TABLE organization
MODIFY user_id int ,
MODIFY industry varchar(255) ,
MODIFY location_id int ,
MODIFY description text ,
MODIFY website_url varchar(255) ,
MODIFY contact varchar(255) ;


-- Allow user_id, institute_type, location_id, description, website_url, and contact to be NULL
ALTER TABLE institute
MODIFY user_id int ,
MODIFY institute_type varchar(255) ,
MODIFY location_id int ,
MODIFY description text ,
MODIFY website_url varchar(255) ,
MODIFY contact varchar(255);


-- Allow year_graduated to be NULL in the education table
ALTER TABLE education
MODIFY year_graduated int;

-- -- Allow year_graduated to be NULL in the education table
ALTER TABLE location
MODIFY state int;

-- Allow issue_date and expiration_date to be NULL in the certifications table
ALTER TABLE certifications
MODIFY issue_date date,
MODIFY expiration_date date;

ALTER TABLE `user` ADD COLUMN `otp` VARCHAR(6);

ALTER TABLE `user` ADD COLUMN `otp_time` TIMESTAMP;

ALTER TABLE `user` ADD COLUMN `verified_user` BOOLEAN;



