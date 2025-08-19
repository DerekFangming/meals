const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
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
const dishKey = 'dishes'

app.get('/api/meal-plans', async (req, res) => {
  try {
    let result = await pool.query(`select key, value from meal_plans where key = ANY($1)`, [decodeURIComponent(req.query.dates).split(",")])
    let response = {}

    for (let r of result.rows) {
      response[r.key] = JSON.parse(r.value)
    }
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({message: e.message})
  }
})

app.put('/api/meal-plans/:date', async (req, res) => {
  try {
    await pool.query(`insert into meal_plans values ($1, $2) on conflict (key) do update set value = $2`, [req.params.date, JSON.stringify(req.body)])
    res.status(200).json(req.body)
  } catch (e) {
    res.status(500).json({message: e.message})
  }
})

async function getAllDishes() {
  let result = await pool.query(`select value from meal_plans where key = $1`, [dishKey])
  if (result.rows.length == 0) {
    return []
  }
  return JSON.parse(result.rows[0].value)
}

app.get('/api/dishes', async (req, res) => {
  try {
    res.status(200).json(await getAllDishes())
  } catch (e) {
    res.status(500).json({message: e.message})
  }
})

app.get('/api/dishes/:id', async (req, res) => {
  try {
    let dishes = (await getAllDishes()).filter(d => d.id == req.params.id)
    if (dishes.length == 0) {
      res.status(404).json({message: 'Not found'})
    } else {
      res.status(200).json(dishes[0])
    }
  } catch (e) {
    res.status(500).json({message: e.message})
  }
})

app.put('/api/dishes/:id', async (req, res) => {
  try {
    let dish = req.body
    dish.id = req.params.id

    let dishes = (await getAllDishes()).filter(d => d.id != req.params.id)
    dishes.push(dish)

    await pool.query(`insert into meal_plans values ($1, $2) on conflict (key) do update set value = $2`, [dishKey, JSON.stringify(dishes)])
    res.status(200).json(dish)
  } catch (e) {
    res.status(400).json({message: e.message})
  }
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
