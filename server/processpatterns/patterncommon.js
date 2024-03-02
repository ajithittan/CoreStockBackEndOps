const getPatternForADate = (inpAllPatterns,inpDate) => {
    if (inpDate){
        return inpAllPatterns.filter(item => item.date === inpDate)[0]
    }else{
        return inpAllPatterns.pop()
    }
}

module.exports ={getPatternForADate}