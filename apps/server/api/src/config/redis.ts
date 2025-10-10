import { createClient, RedisClientType } from 'redis'; // Import RedisClientType

// Create and export the redis client instance
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL, // Use an environment variable for the Redis URL
  // url: process.env.REDIS_URL || 'redis://localhost:6379', 
});

//------- hendale connection ------------//
redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err: any) => {
  // Explicitly type 'err' as 'any' or a more specific error type
  console.error('Redis Client Error:', err);
});

//------------Call / Connect to RedisClient --------------/
async function connectRedis() {
  try {
    //connect() is start to open redisClient server and TCP connection Redis server (local or remote)
    await redisClient.connect();
    console.log('Redis client connected successfully.');
  } catch (err: any) {
    // Explicitly type 'err'
    console.error('Failed to connect to Redis:', err);
    process.exit(1); // Exit the process if Redis connection fails
  }
}

connectRedis(); // Call the connect function
