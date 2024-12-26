const getFunctionToRun = (inpType) =>{
    if (inpType === "indicators"){
        let patterns = require("../processpatterns/patternrecognition")
        return patterns.patternRecogForStks
    }
}

//configure new ite,s in the workflow and it will be initiated.
const workflowseq = [{
    "type":"indicators",
    "function": getFunctionToRun("indicators"),
    "stkcounts": 125
}]

const checkIfFnIsStillOn = async (inpTp) =>{
    const fnstate = require("../Util/calculateTimeTaken");
    let objfnstate = new fnstate.TimeTakenByFn(inpTp,null,null)
    return await objfnstate.getStatusOfFunction()
}

const startFunction= async (inpTp) =>{
    const fnstate = require("../Util/calculateTimeTaken");
    let objfnstate = new fnstate.TimeTakenByFn(inpTp,null,null)
    return await objfnstate.startFunction()
}

const stopFunction= async (inpTp) =>{
    const fnstate = require("../Util/calculateTimeTaken");
    let objfnstate = new fnstate.TimeTakenByFn(inpTp,null,null)
    return await objfnstate.stopFunction()
}

const startProcessing = async (inpParams,inpStks) => {
    const _= require("lodash") 
    let st = Date.now()
    console.log("inpParamsinpParams",inpStks)
    try {
        let arrayofbatches = _.chunk(inpStks,inpParams["stkcounts"])
        await startFunction(inpParams["type"])
        for(let i=0;i<arrayofbatches.length;i++){
            await inpParams["function"](arrayofbatches[i])
        }
    }
    finally {
        await stopFunction(inpParams["type"])
        timeTakenByFunction(inpParams["type"],st,Date.now())
    }
}

const timeTakenByFunction = async (fn,st,et) =>{
    const timeTakenObj = require("../Util/calculateTimeTaken");
    let objtmtaken = new timeTakenObj.TimeTakenByFn(fn,st,et)
    objtmtaken.storeToCache()
}

const initiateWrkFlwIntraDay = async (inpStks) => {
    for(let i=0;i<workflowseq.length;i++){
        await checkIfFnIsStillOn(workflowseq[i]["type"]).then(retval => {
            if (retval){
                //stopFunction(workflowseq[i]["type"])
                console.log("job still running.... - ",workflowseq[i]["type"])
            }else{
                console.log("start job.... - ",workflowseq[i]["type"])
                //startProcessing(workflowseq[i],inpStks)                
            }}
        )
    }
}

module.exports = {initiateWrkFlwIntraDay}