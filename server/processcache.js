const getUrlToExecute = async (inpURLCode) =>{
    const URLConfig = require("../config/url.config");
    const urlconf = new URLConfig()
    return urlconf[inpURLCode]
}

const getConfigToExecuteCache = async (processIdentifier) => {
    const CacheConfig = require("../config/cacheuploader.config");
    return CacheConfig(processIdentifier)
}

const buildPathOfUrl = async (inpData,configPath) =>{
    for (let i=0;i<inpData.length;i++){
        configPath = configPath.replace(i.toString(),inpData[i].value)
    }
    return configPath
}

const getDataAndUploadToCache = async (inpData,cacheKey) =>{
    let configForProcess = await getConfigToExecuteCache(inpData.processId)
    let url = await getUrlToExecute(configForProcess.urlKey)
    let path = await buildPathOfUrl(inpData.params,configForProcess.path)
    console.log("cacheKey",cacheKey)
    getDataFromSource(url+path).then(retval => addToCache(retval,cacheKey,configForProcess.ttl))
    return true
}

const getDataFromSource = async (url) =>{
    const fetch = require("node-fetch");
    let response = []
    try{
      await fetch(url , {method:'get', headers: { 'Content-Type': 'application/json' }})
      .then(res => res.json())
      .then(json => {response=json});
    }
    catch (err){
      console.log(err)
    } 
    return response
}

const getCacheKeyForProcess = async (inpData) => {
    let cacheKey = inpData.processId
    let params = inpData.params
    for (let i=0;i<params.length;i++){
        cacheKey = cacheKey + "_" + params[i].value 
    }
    return cacheKey
}

const checkIfCacheExists = async (cacheKey) =>{
    let cacheitems = require("../servercache/cacheitemsredis")
    return await cacheitems.getCache(cacheKey)
}

const addToCache = async (inpData,cacheKey,ttl) =>{
    let cacheitems = require("../servercache/cacheitemsredis")
    return await cacheitems.setCacheWithTtl(cacheKey,inpData,ttl)
}

const initiateCacheLoadProcess = async (inpData) =>{
    console.log("initiateCacheLoadProcess - process to cache",inpData)
    try {
        getCacheKeyForProcess(inpData).then(cacheKey => checkIfCacheExists(cacheKey).then(cacheVal =>{
            if (!cacheVal){
                console.log("Cache miss - Upload Away",inpData)
                getDataAndUploadToCache(inpData,cacheKey)
            }else{
                console.log("Cache hit - move on",inpData)
            }
        }))                
    } catch (error) {
        console.log("ERROR in initiateCacheLoadProcess",inpData,error)
    }
    return true
}

module.exports = {initiateCacheLoadProcess}