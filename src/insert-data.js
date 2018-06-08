const transactions1 = require('./transactions-1.json')
const transactions2 = require('./transactions-2.json')
const queryClient = require('./pg-client')

const generateValSql = () => {
  let step
  let s = '('
  for (step = 1; step < 18; step++) {
    if (step < 17) {
      s += ` $${step},`
    } else if (step === 17) {
      s += ` $${step} )`
    }
  }
  return s
}

const handleInsertResponse = (res) => {
  if (res.rowCount > 0) {
    console.log(`Insert response successful: ${JSON.stringify(res)}`)
  }else {
    throw new Error('There was a problem inserting the data\'s')
  }
  return res
}

const insertTransactionData = async (data) => {
  const queryString =
      `INSERT INTO transaction (amount, confirmations, address, last_block, block_hash, tx_id, block_index, label, category, vout, block_time, time, time_received, bip125_replaceable, involves_watch_only, wallet_conflicts, removed)
       VALUES ${generateValSql()};`
  const response = await queryClient(queryString, data);
  return Promise.resolve(handleInsertResponse(response))
}

const reduceTransactions = (transactions) => {
  return transactions.reduce((acc, txns) => {
    //todo handled removed blocks
    const lastBlock = txns.lastblock;
    return acc.concat(txns.transactions.map((txn) => {
      return [txn.amount, txn.confirmations, txn.address, lastBlock, txn.blockhash, txn.txid, txn.blockindex, txn.label, txn.category, txn.vout, new Date(txn.blocktime), new Date(txn.time), new Date(txn.timereceived), txn["bip125-replaceable"], txn.involvesWatchonly, false, false]
    }))
  }, [])

}

console.log('Reducing transactions...')
const reducedValues = reduceTransactions([transactions1, transactions2])
console.log('Transactions reduced...')

console.log('Inserting data...')
Promise.all(reducedValues.map((rt) => {
  return new Promise((resolve) => {
    resolve(insertTransactionData(rt))
  })
})).then(() => {
  console.log('Data insertion complete.')
}).catch((err) => {
  console.log(`Something went wrong ${JSON.stringify(err)}`)
})


