const getFunctionToRun = (inpType) =>{
    if (inpType === "intradayindicators"){
        let patterns = require("../processpatterns/patternrecognition")
        return patterns.intradaypatternRecogForStks
    }
}

//configure new ite,s in the workflow and it will be initiated.
const workflowseq = [{
    "type":"intradayindicators",
    "function": getFunctionToRun("intradayindicators"),
    "stkcounts": 100
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
    const moment = require("moment");
    const _= require("lodash") 
    let statusOfProcess = false
    let returnInformation = {}
    console.log("inpParams and inpStks",inpParams,inpStks)
    try {
        //uncomment below in dev so it doesnt go crazy looking for all data
        //let arrayofbatches = _.chunk(inpStks.slice(0,20),inpParams["stkcounts"])
        let arrayofbatches = _.chunk(inpStks,inpParams["stkcounts"])
        await startFunction(inpParams["type"])
        for(let i=0;i<arrayofbatches.length;i++){
            await inpParams["function"](arrayofbatches[i])
        }
        statusOfProcess = true
        returnInformation = {'cntstocks':inpStks.length,'batches':arrayofbatches.length,'date':moment().format("YYYY-MM-DD")}
    }
    catch (err){
        console.log("error in startProcessing function",err)
        returnInformation = {'err':err,'date':moment().format("YYYY-MM-DD")}
      } 
    finally {
        await stopFunction(inpParams["type"])
    }
    return {statusOfProcess,returnInformation}
}

const initiateProcessing = async (args,fn) =>{
    let deco = require("../Util/decortorcalctimetaken")
    return await deco.TimeTakenDecorator(startProcessing,fn)(...args)
}

const initiateWrkFlwIntraDay = async (inpStks) => {
    for(let i=0;i<workflowseq.length;i++){
        await checkIfFnIsStillOn(workflowseq[i]["type"]).then(retval => {
            if (retval){
                //stopFunction(workflowseq[i]["type"])
                console.log("job still running.... - ",workflowseq[i]["type"])
            }else{
                console.log("start job.... - ",workflowseq[i]["type"])
                initiateProcessing([workflowseq[i],inpStks],workflowseq[i]["type"])        
            }}
        )
    }
}

module.exports = {initiateWrkFlwIntraDay}