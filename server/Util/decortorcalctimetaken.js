function TimeTakenDecorator(inpFunction,fn) {
    return async function(...args) {
        const timeTakenObj = require("./calculateTimeTaken");
        let st = Date.now()
        let {statusOfProcess:retstat,returnInformation:retinfo} = await inpFunction(...args)
        let et = Date.now()
        let objtmtaken = new timeTakenObj.TimeTakenByFn(fn,st,et,retinfo)
        objtmtaken.storeToCache()
        return retstat
    }
}

module.exports = {TimeTakenDecorator};