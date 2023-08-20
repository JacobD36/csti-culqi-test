import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

export const redisClient = createClient({
    url: process.env.REDIS_URL || '',
});

redisClient.connect();

redisClient.on('error', (err) => {
    console.log(`Error en Redis: ${err}`);
});

export default redisClient;

