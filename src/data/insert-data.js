const transactions1 = require('./transactions-1.json')
const transactions2 = require('./transactions-2.json')
const customers = require('./customers.json')
const queryClient = require('../pg-client')

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
    // console.log(`Insert response successful: ${JSON.stringify(res)}`)
  }else {
    throw new Error('There was a problem inserting the data\'s')
  }
  return res
}

const insertData = async (query, data) => {
  const response = await queryClient( query, data);
  return Promise.resolve(handleInsertResponse(response))
}

const reduceTransactions = (transactions) => {
  return transactions.reduce((acc, txns) => {
    // handled removed blocks ...
    const lastBlock = txns.lastblock;
    return acc.concat(txns.transactions.map((txn) => {
      //ordered
      return [txn.amount, txn.confirmations, txn.address, lastBlock, txn.blockhash, txn.txid, txn.blockindex, txn.label, txn.category, txn.vout, new Date(txn.blocktime), new Date(txn.time), new Date(txn.timereceived), txn["bip125-replaceable"], txn.involvesWatchonly, false, false]
    }))
  }, [])

}

//todo extract these into one function

const insertTransactions = () => {
  const q = `INSERT INTO transaction (amount, confirmations, address, last_block, block_hash, tx_id, block_index, label, category, vout, block_time, time, time_received, bip125_replaceable, involves_watch_only, wallet_conflicts, removed) VALUES ${generateValSql()};`
  console.log('Inserting transaction data...')
  return Promise.all(reduceTransactions([transactions1, transactions2]).map((rt) => {
    return new Promise((resolve) => {
      resolve(insertData(q, rt))
    })
  })).then(() => {
    console.log('Transaction data insertion complete.')
    return Promise.resolve();
  }).catch((err) => {
    console.log(`Something went wrong ${JSON.stringify(err)}`)
    process.exit(0)
  })
}

const insertCustomer = () => {
  const q = `INSERT INTO customer (name, address, weight) VALUES ($1, $2, $3)`;
  console.log('Inserting customer data...')
  return Promise.all(Object.keys(customers).map((cv) => {
    return [customers[cv].name, cv, customers[cv].weight]
  }).map((rt) => {
    return new Promise((resolve) => {
      resolve(insertData(q, rt))
    })
  })).then(() => {
    console.log('Customer data insertion complete.')
    return Promise.resolve();
  }).catch((err) => {
    console.log(`Something went wrong ${JSON.stringify(err)}`)
    process.exit(0)
  })

}

const process  = async() => {
  await insertTransactions()
  await insertCustomer()
}

process()



