const getQuotesWithDates = async (stksym,frmdate,enddt) => {
    let response = []
    try{
        const yahooFinance = require('yahoo-finance2').default
        await yahooFinance.historical(stksym,{
          period1: frmdate,
          period2: enddt
        }).then(result => response=result)
        response = response.map(obj => ({ ...obj,date:obj.date.toISOString().split('T')[0], symbol: stksym}))  
    }catch(err){
        console.log("error in Yahoo function getQuotesWithDates",err)
    }
    return response
}

module.exports={getQuotesWithDates}