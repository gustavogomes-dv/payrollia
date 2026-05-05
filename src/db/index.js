const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'payroll',
    password: 'payroll123',
    database: 'payroll',
});

pool.on('connect', () => {
    console.log('PostgreSQL conectado');
});

// Redis
const redisClient = redis.createClient({
    socket: {
    host: 'localhost',
    port: 6379,
    }
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

module.exports = { pool, redisClient };