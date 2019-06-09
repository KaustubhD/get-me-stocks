'use strict'

var expect = require('chai').expect
var MongoClient = require('mongodb')
const fetch = require('node-fetch')

const CONNECTION_STRING = process.env.DB //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


function cleanUpStockObject(obj, apiData){
  delete obj.stockData.symbol
  delete obj.stockData._id
  obj.stockData.stock = apiData['Global Quote']['01. symbol']
  obj.stockData.price = apiData['Global Quote']['05. price']
  return obj
}


async function getData(stock){
  // console.log('Calling')
  return await MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true})
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
          // price: stock.price
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
      .then(doc => doc.value)
    })
    .catch(err => console.error(err))
  })
  .catch(err => console.error('Error in connection', err))
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      
      let symbol = req.query.stock
      let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
      let like = req.query.like ? 1 : 0
      
      const noName = {symbol, ip, like}
      
      if(typeof symbol == 'string'){
        
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.query.stock}&apikey={process.env.KEY}`)
        .then(res => res.json())
        .then(async data => {
          let stock = {}
          await getData(noName).then(st => stock.stockData = st)
          stock = cleanUpStockObject(stock, data)
          res.json(stock)
        })
      
      }
    
      else if(Array.isArray(symbol)){
        
        
        
        
        
        
      }
    //   fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.query.stock}&apikey={process.env.KEY}`)
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    
    
    
    
    })
}
