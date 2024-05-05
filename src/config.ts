// src/config.ts
import dotenv from 'dotenv';

dotenv.config();

export const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    JWT_SECRET,
} = process.env;
