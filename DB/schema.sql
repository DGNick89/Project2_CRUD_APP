CREATE DATABASE sportsAPP;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300),
    email TEXT UNIQUE,
    password_digest TEXT,
    profile_pic TEXT
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    sport TEXT,
    location TEXT,
    time TIME,
    user_id INTEGER
);

CREATE TABLE players_joined (
    id SERIAL PRIMARY KEY,
    game_id INTEGER,
    user_id INTEGER
);