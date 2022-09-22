const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

exports.setCache = (key,val) => {
    return myCache.set(key,val)
}

exports.setCacheWithTtl = (key,val,ttl) => {
    return myCache.set(key,val,ttl)
}

exports.getCache = (key) =>{
    return myCache.get(key)
}

exports.getCacheStats = () =>{
    return myCache.getStats()
}

exports.getCacheKeys = () =>{
    return myCache.keys()
}

exports.flushAll = () =>{
    return myCache.flushAll()
}

exports.delCachedKey = (key) =>{
    return myCache.del(key)
}