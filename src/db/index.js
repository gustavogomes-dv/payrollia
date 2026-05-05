const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://payroll:payroll123@localhost:5432/payroll',
});

pool.on('connect', () => {
    console.log('PostgreSQL conectado');
});

// Redis
const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

module.exports = { pool, redisClient };