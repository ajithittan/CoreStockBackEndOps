const Redis = require("ioredis");
require('dotenv').config()
var redisClient

(async () => {
    redisClient = new Redis({port: process.env.REDIS_STOCK_QUOTES_PORT,host: process.env.REDIS_STOCK_QUOTES_SERVER,
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
            console.warn(`Retrying redis connection: attempt ${times}`);
            return Math.min(times * 200, 2000);
        }
    });
    redisClient.on('error', function (err) {
        console.log('Could not establish a connection with redis. - ' + err);
    });
    redisClient.on('connect', function (err) {
        console.log('STOCK QUOTES CACHE - Connected to redis successfully');
    });
    
})()

exports.setCache = (key,val) => {
    return redisClient.set(key,val)
}

exports.setCacheWithTtl = async (key,val,ttl) => {
    return redisClient.set(key,JSON.stringify(val),'EX', ttl).then((data,err) => data)
}

exports.getCache = async (key) =>{
    return redisClient.get(key).then(cacheval => {
        if (cacheval!=="") 
            return JSON.parse(cacheval) 
    })
}

exports.getCacheStats = () =>{
    return redisClient.getStats()
}

exports.getCacheKeys = () =>{
    return redisClient.keys()
}

exports.flushAll = () =>{
    return redisClient.flushAll()
}

exports.delCachedKey = (key) =>{
    return redisClient.del(key)
}