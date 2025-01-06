const URLConfig = require("../../../config/url.config");
const urlconf = new URLConfig()
const PRED_PATTERN_URL = urlconf.PRED_PATTERN

const triggerAllPatterns = async (inpstks) =>{
    const fetch = require("node-fetch");
    let response = {}
    const moment = require('moment');
    const now = moment(); // Creates a Moment object representing the current time
    const timestampInSeconds = now.unix(); 
    await fetch(PRED_PATTERN_URL + 'predictions/kickoff/1/' + timestampInSeconds, 
        {method:'post', body:JSON.stringify(inpstks), 
        headers: { 'Content-Type': 'application/json' }})
        .then(res => res.json())
        .then(json => {response=json;console.log("retval from triggering job",json)});

    return response
}

module.exports = {triggerAllPatterns}