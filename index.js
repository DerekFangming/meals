const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const { Client } = require('pg')

const port = '9005'
const app = express()
app.use(bodyParser.json({limit: '100mb'}), cors())


app.post('/api/send-code', async (req, res) => {
  console.log(`Receive code ${req.body.code}`)

  res.status(200).json({})
})


app.get('/test', async (req, res) => {
  res.status(200).json({})
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('*', function (req, res) {
  fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
    res.send(text)
  })
})

app.listen(port, () => {
  console.log(`meals app started on port ${port}`)
})

// async function getUrl() {
//   const client = new Client({
//     user: 'postgres',
//     host: process.env.PRODUCTION ? 'localhost' : '10.0.1.100',
//     database: process.env.PRODUCTION ? 'fmning' : 'test',
//     password: process.env.DATABASE_PASSWORD,
//     port: 5432,
//   })

//   try {
//     await client.connect()
//     let result = await client.query(`select value from configurations where key = $1`, ['HA_CODE_WEBHOOK_URL'])
//     webhookUrl = result.rows[0].value
//   } finally {
//     await client.end()
//   }
// }

// getUrl()
