'use strict'

var expect = require('chai').expect
var MongoClient = require('mongodb')
const fetch = require('node-fetch')

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


function changeToRelLikes(stocks){
  stocks.stockData[0].likes -= stocks.stockData[1].likes
  stocks.stockData[1].likes = -1 * stocks.stockData[0].likes
  return stocks
}

function cleanUpStockObject(doc, apiData){
  // console.log(doc, apiData)
  delete doc.symbol
  delete doc._id
  delete doc.ip
  doc.stock = apiData['Global Quote']['01. symbol']
  doc.price = apiData['Global Quote']['05. price']
  return doc
}


async function getData(stock){
  
  return await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey={process.env.KEY}`)
  .then(res => res.json())
  .then(data => {
    
    return MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true})
    .then(db => {
      return db.db().collection('stocks')
      .findOne({symbol: stock.symbol})
      .then(doc => {
        //check for ip
        // console.log(doc)
        const isValidLike = !(doc && doc.ip && doc.ip.includes(stock.ip))
        return db.db().collection('stocks')
        .findOneAndUpdate({symbol: stock.symbol}, {
          $setOnInsert: {
            symbol: stock.symbol,
          },
          $addToSet: {
            ip: stock.like && stock.ip
          },
          $inc: {
            likes: isValidLike && stock.like ? 1 : 0
          }
        }, {
          upsert: true,
          returnOriginal: false
        })
        .then(doc => cleanUpStockObject(doc.value, data))
      })
      .catch(err => err)
    })
    .catch(err => err)
    
  })
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      
      let symbol = req.query.stock
      let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
      let like = req.query.like ? 1 : 0
      
      const noName = {symbol, ip, like}
      
      if(typeof symbol == 'string'){
        
        let stock = {}
        await getData(noName)
        .then(st => stock.stockData = st)
        .catch(err => res.status(400).send(err))
        
        // console.log(stock)
        res.json(stock)
      
      }
      else if(Array.isArray(symbol)){
        let noNames = []
        symbol.map(symbol => {
          noNames.push({ symbol, ip, like })
        })
        
        const promiseArray = noNames.map(noname => getData(noname))
        // console.log(noNames)
        let stocks = {}
        await Promise.all(promiseArray)
        .then(st => stocks.stockData = st)
        .catch(err => res.status(400).send(err))
        stocks = changeToRelLikes(stocks)
        
        // console.log(stocks)
        res.json(stocks)
         
      }
    
    })
}
