const queryClient = require('./pg-client')

let dataString = '\n\n\n\n\n\n\n\n\n\n'

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

const handleDepositResponse = (res, data) => {
    return {[data]: res.rows}
}

const handleCustomerResponse = (res) => {
    return res.rows.reduce((acc, cv) => {
      acc[cv.address] = cv.name
      return acc
    }, {})
}

const queryForResult = async (q, data, handler) => {
  const response = await queryClient(q, data)
  if(response.rowCount > 0) {
    return Promise.resolve(handler(response, data))
  }
  return Promise.reject()
}

const processDepositTransactions = async function (custMap) {
  const q = 'SELECT t.amount FROM transaction AS t WHERE t.confirmations > 5 AND t.address = $1;'
  const depMap = await Promise.all(Object.keys(custMap).map((a) => {
      return Promise.resolve().then(() => {
        return queryForResult(q, [a], handleDepositResponse)
      })
    })).then((res) => { //reduce Promise.all array into a map
    return res.reduce((acc, cv) => {
      const key = Object.keys(cv)[0];
      acc[key] = cv[key]
      return acc
    }, {})
  });

  return Object.keys(custMap).reduce((acc, cv) => {
    return acc.concat(`Deposited for ${custMap[cv]} count=${depMap[cv].length} sum=${round(depMap[cv].reduce((acc, cv) => cv.amount + acc, 0), 9)}\n`)
  }, dataString);

};

const processDepositsWithoutReference = async () => {

}

const processSmallestValidDeposit = async () => {

}

const processLargestValidDeposit = async () => {

}

const process = async () => {
  const customerMap = await queryForResult('SELECT name, address FROM customer AS c ORDER BY c.weight;', undefined, handleCustomerResponse);
  dataString = await processDepositTransactions(customerMap);
  dataString.concat(`\n${processDepositsWithoutReference()}`)
  dataString.concat(`\n${processSmallestValidDeposit()}`)
  dataString.concat(`\n${processLargestValidDeposit()}`)
  console.log(dataString)
}

process()





