const {Pool} = require('pg')

// pools will use environment variables
// for connection information
const pool = new Pool()

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

pool.on('connect', (client) => {
  console.log("New client connection from pool")
})

const query = async (queryString, values) => {
  const client = await pool.connect()
  try {
    return await client.query(queryString, values)
  } catch (e) {
    console.log(e.stack)
  } finally {
    client.release()
  }
}

module.exports = query