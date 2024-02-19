const countCheckFunction = async (allPatterns,rule) =>{
    if (allPatterns.length >= parseInt(rule.ruleparam)){
        return true
    }else{
        return false
    }
}

const getPatternRuleFunction = async (ruleTp) =>{
    const ruleFnMapping = {
        "count" : countCheckFunction
    }
    return ruleFnMapping[ruleTp]
}

module.exports={getPatternRuleFunction}