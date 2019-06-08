'use strict'

var expect = require('chai').expect
var MongoClient = require('mongodb')
const fetch = require('node-fetch')

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      let stock = req.query.stock
      let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(',')[0]
      let like = req.query.lik ? 1 : 0
      
      
      if(typeof stock == 'string'){
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.query.stock}&apikey={process.env.KEY}`)
        .then(res => res.json())
        .then(data => {
          
          console.log(data)
        
        
        })
        
        
      
      
      
      }
    
    
    
      else if(Array.isArray(stock)){
        
        
        
        
        
        
      }
    //   fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.query.stock}&apikey={process.env.KEY}`)
    //     .then(res => res.json())
    //     .then(data => console.log(data))
    
    
    
    
    })
}
