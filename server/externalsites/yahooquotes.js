const getQuotesWithDates = async (stksym,frmdate,enddt) => {
    const yahooFinance = require('yahoo-finance2').default
    await yahooFinance.historical(stksym,{
      period1: frmdate,
      period2: enddt
    }).then(result => response=result)
    response = response.map(obj => ({ ...obj, symbol: stksym}))
    return response
}

module.exports={getQuotesWithDates}