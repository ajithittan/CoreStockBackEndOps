function TimeTakenDecorator(inpFunction,fn) {
    return async function(...args) {
        const timeTakenObj = require("./calculateTimeTaken");
        let st = Date.now()
        let retval = await inpFunction(...args)
        let et = Date.now()
        let objtmtaken = new timeTakenObj.TimeTakenByFn(fn,st,et)
        objtmtaken.storeToCache()
    }
}

module.exports = {TimeTakenDecorator};