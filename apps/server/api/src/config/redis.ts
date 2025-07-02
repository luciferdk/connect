import { createClient, RedisClientType } from 'redis'; // Import RedisClientType

// Create and export the redis client instance
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379', // Use an environment variable for the Redis URL
});

redisClient.on('connect', () => {
  console.log('Connected to Redis!');
});

redisClient.on('error', (err: any) => {
  // Explicitly type 'err' as 'any' or a more specific error type
  console.error('Redis Client Error:', err);
});

// Connect to Redis
async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully.');
  } catch (err: any) {
    // Explicitly type 'err'
    console.error('Failed to connect to Redis:', err);
    process.exit(1); // Exit the process if Redis connection fails
  }
}

connectRedis(); // Call the connect function

// You might also want to export the connect function if you need to manually trigger it elsewhere
// export { connectRedis };

// If you need to use redisClient in other files, it's already exported above.
