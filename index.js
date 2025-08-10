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
    '8/4/2025': {
      snack: ['苏打饼干'],
    },
    '8/5/2025': {
      lunch: ['饭菜1', '饭菜2', '饭菜3', '饭菜4', '饭菜5', '饭菜6'],
    },
    '8/7/2025': {
      breakfast: ['馒头', '炒菜', '白粥'],
      lunch: ['红烧肉', '面包', '汤', '菜心'],
      dinner: ['石锅拌饭'],
    }
  })
})

app.post('/api/meal-plans', async (req, res) => {
  console.log(`Receive code ${req.body.code}`)

  res.status(200).json({})
})

app.get('/api/meals', async (req, res) => {
  res.status(200).json({
    '月子餐': {
      'label': '月子餐',
      'categories': {
        '荤菜': ['花生闷猪蹄', '红烧肉', '花生闷猪蹄', '红烧肉', '花生闷猪蹄', '红烧肉', '花生闷猪蹄', '红烧肉', '花生闷猪蹄', '红烧肉', '花生闷猪蹄', '红烧肉'],
        '素菜': ['炒青菜'],
        '粥类': ['小米粥'],
        '主食': ['白饭'],
      }
    },
    '健康饮食': {
      'label': '健康饮食'
    },
    '大鱼大肉': {
    }
  })
})


app.get('/test', async (req, res) => {
  // let result = await pool.query(`select key, value from meal_plans where key = $1`, ['foo'])
  // console.log(result.rows[0].key + ' - ' + result.rows[0].value)
  
  let result = await pool.query(`select key, value from meal_plans`, [])
  console.log(result.rows.length)
  console.log(result.rows[0].key + ' - ' + result.rows[0].value)
  console.log(result.rows[1].key + ' - ' + result.rows[1].value)
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
