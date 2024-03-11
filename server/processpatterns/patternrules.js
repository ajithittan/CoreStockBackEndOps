
const countCheckFunction = async (allPatterns,rule) =>{
    if (allPatterns.length >= parseInt(rule.ruleparam)){
        return allPatterns
    }else{
        return undefined
    }
}

const checkPatternType = async (allPatterns,rule) =>{
    const _= require("lodash")  
    const intersectedarr = _.intersection( rule.ruleparam,allPatterns.map(item => item.type))
    if (intersectedarr.length > 0){
        return allPatterns.filter(item => rule.ruleparam.includes(item.type))
    }else{
        return undefined
    }
}

const getPatternRuleFunction = async (ruleTp) =>{
    const ruleFnMapping = {
        "count" : countCheckFunction,
        "patterntype" : checkPatternType
    }
    return ruleFnMapping[ruleTp]
}

const getPatternRulesToWatch = async () =>{
    return [
        {"type":"count","ruleparam":3,"priority":1},
        {"type":"patterntype","ruleparam":["CLASS_MDL"],"priority":2}
    ]
}

module.exports={getPatternRuleFunction,getPatternRulesToWatch}