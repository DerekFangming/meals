const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const axios = require('axios')
const fs = require('fs')
const pg = require('pg')

const port = '9005'
const app = express()
app.use(bodyParser.json({limit: '100mb'}), cors())

dbConfig = {
  user: 'postgres',
  host: process.env.PRODUCTION ? 'localhost' : '10.0.1.100',
  database: process.env.PRODUCTION ? 'fmning' : 'test',
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000 
}

let pool = new pg.Pool(dbConfig)

app.get('/api/meal-plans', async (req, res) => {
  console.log(`Receive code ${req.query.dates}`)

  res.status(200).json({
    '8/11/2025': {
      snack: ['苏打饼干'],
    },
    '8/14/2025': {
      lunch: ['饭菜1', '饭菜2', '饭菜3', '饭菜4', '饭菜5', '饭菜6'],
    },
    '8/15/2025': {
      breakfast: ['馒头', '炒青菜', '白粥'],
      lunch: ['红烧肉', '面包', '汤', '菜心'],
      dinner: ['石锅拌饭'],
    }
  })
})

app.post('/api/meal-plans', async (req, res) => {
  console.log(`Receive code ${req.body.code}`)

  res.status(200).json({})
})

app.get('/api/dishes', async (req, res) => {
  res.status(200).json([{
    'id': 'postpartum',
    'name': '月子餐',
    'categories': [
      {
        'name': '荤菜',
        'dishes': ['花生闷猪蹄', '红烧肉']
      },
      {
        'name': '素菜',
        'dishes': ['炒青菜', '汤', '菜心']
      },
      {
        'name': '粥类',
        'dishes': ['小米粥', '白粥']
      },
      {
        'name': '主食',
        'dishes': ['白饭', '馒头', '面包', '石锅拌饭', '苏打饼干']
      }
    ]
  }, {
    'id': 'healthy',
    'name': '健康饮食',
    'categories': []
  }, {
    'id': 'meaty',
    'name': '大鱼大肉',
    'categories': []
  }])
})


app.get('/test', async (req, res) => {
  // let result = await pool.query(`select key, value from meal_plans where key = $1`, ['foo'])
  // console.log(result.rows[0].key + ' - ' + result.rows[0].value)
  
  // let result = await pool.query(`select key, value from meal_plans`, [])
  let result = await pool.query(`select key, value from meal_plans where key =ANY($1)`, [['foo', 'key']])
  console.log(result.rows.length)

  for (let r of result.rows) {
    console.log(r.key + ' - ' + r.value)
  }
  // console.log(result.rows[1].key + ' - ' + result.rows[1].value)
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
  // const client = new Client({
  //   user: 'postgres',
  //   host: process.env.PRODUCTION ? 'localhost' : '10.0.1.100',
  //   database: process.env.PRODUCTION ? 'fmning' : 'test',
  //   password: process.env.DATABASE_PASSWORD,
  //   port: 5432,
  // })

//   try {
//     await client.connect()
//     let result = await client.query(`select value from configurations where key = $1`, ['HA_CODE_WEBHOOK_URL'])
//     webhookUrl = result.rows[0].value
//   } finally {
//     await client.end()
//   }
// }

// getUrl()
