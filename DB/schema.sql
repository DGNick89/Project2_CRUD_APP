CREATE DATABASE sportsAPP;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300),
    email TEXT UNIQUE,
    password_digest TEXT,
    profile_pic TEXT
);