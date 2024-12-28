"use strict";

function TimeTakenByFn (fnName,strTime,endTime,retInfo) {
    this.fnName = fnName
    this.strTime = strTime
    this.endTime = endTime
    this.retInfo = retInfo
}   

TimeTakenByFn.prototype.storeToCache = async function  () {
    let cacheitems = require("../../servercache/cacheitemsredis")
    let timeTaken = (this.endTime - this.strTime)/1000
    let summaryOfJob = {}
    summaryOfJob["st"] = this.strTime
    summaryOfJob["et"] = this.endTime
    summaryOfJob["tt"] = timeTaken
    summaryOfJob["rv"] = this.retInfo
    summaryOfJob["fn"] = this.fnName
    await cacheitems.setCacheWithTtl(process.env.CACHE_KEY_FN_TIME + this.fnName,timeTaken,process.env.CACHE_KEY_FN_TIME_TTL)
    await cacheitems.addToCacheStream(process.env.STREAM_KEY_FN_SUMMARY,parseInt(this.endTime),JSON.stringify(summaryOfJob))
    return true
};

TimeTakenByFn.prototype.getStatusOfFunction = async function  () {
    let cacheitems = require("../../servercache/cacheitemsredis")
    let retval = await cacheitems.getCache(process.env.CACHE_KEY_FN_STATUS + this.fnName)
    return retval
};

TimeTakenByFn.prototype.startFunction = async function  () {
    let cacheitems = require("../../servercache/cacheitemsredis")
    await cacheitems.setCacheWithTtl(process.env.CACHE_KEY_FN_STATUS + this.fnName,1,process.env.CACHE_KEY_FN_STATUS_TTL)
    return true
};

TimeTakenByFn.prototype.stopFunction = async function  () {
    let cacheitems = require("../../servercache/cacheitemsredis")
    await cacheitems.setCacheWithTtl(process.env.CACHE_KEY_FN_STATUS + this.fnName,0,process.env.CACHE_KEY_FN_STATUS_TTL)
    return true
};

module.exports = {TimeTakenByFn};
