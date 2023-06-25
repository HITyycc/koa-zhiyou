import redis from 'ioredis';
import Config from "config"

export const redisClient = new redis({
    port: Config.get("redis.port"),
    host: Config.get("redis.host")
});
