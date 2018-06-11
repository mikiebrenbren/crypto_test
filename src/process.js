const process = async() => {
  await require('./transaction-processor')()
  await require('./data/insert-data')()
}

process()
