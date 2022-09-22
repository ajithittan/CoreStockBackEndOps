require('dotenv').config()

const redis = require("redis");
const rdsclient = redis.createClient(process.env.REDIS_SERVER_PUBSUB);

rdsclient.on("error", function(error) {
    console.log("Error emitted by redis is ------")  
    console.error(error);
});

const publisher = async (type,message) =>{

    try{
        console.log(rdsclient)
        await rdsclient.connect();
        await rdsclient.publish(type,JSON.stringify(message))
    }catch(error){
        console.log("Error in publisher function for redis",error)
        return false
    }
    return true
}

module.exports = {publisher}