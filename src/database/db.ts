// src/database/db.ts
import { Pool } from 'pg';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from '../config';

const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: 5432,
});

export default pool;

