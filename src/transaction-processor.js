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

const processDepositTransactions = async function () {
  const custMap = await queryForResult('SELECT name, address FROM customer AS c ORDER BY c.weight;', undefined, handleCustomerResponse);
  const q = 'SELECT t.amount FROM transaction AS t WHERE t.confirmations > 5 AND t.address = $1;'
  const depMap = await Promise.all(Object.keys(custMap).map((a) => {
      return Promise.resolve().then(() => {
        return queryForResult(q, [a], handleDepositResponse)
      })
    })).then((res) => {
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
  const res = await queryForResult('SELECT t.amount FROM transaction t WHERE NOT EXISTS(SELECT * FROM customer c WHERE t.address = c.address);', undefined, (res) => res.rows)
  const txnSum = res.reduce((acc, cv) => {
    return round(acc + cv.amount, 9)
  }, 0);
  return `Deposited without reference: count=${res.length} sum=${txnSum}`
}

const processSmallestValidDeposit = async () => {
  return `Smallest valid deposit: ${await queryForResult('SELECT MIN(amount) FROM transaction t WHERE t.confirmations > 5;', undefined, (res) => res.rows[0].min)}`
}

const processLargestValidDeposit = async () => {
  return `Largest valid deposit: ${await queryForResult('SELECT MAX(amount) FROM transaction t WHERE t.confirmations > 5;', undefined, (res) => res.rows[0].max)}`
}

const process = async () => {
  dataString = await processDepositTransactions()
  dataString = dataString.concat(
      `${await processDepositsWithoutReference()}\n`, `${await processSmallestValidDeposit()}\n`, `${await processLargestValidDeposit()}\n`
  );
  console.log(dataString)
}

process()





