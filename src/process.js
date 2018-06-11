const process = async() => {
  await require('./data/insert-data')()
  await require('./transaction-processor')()
}

process()
