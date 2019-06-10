/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let likes_1, likes_2
    
    
    suite('GET /api/stock-prices => stockData object', function() {
      
//       test('1 stock', function(done) {
//        chai.request(server)
//         .get('/api/stock-prices')
//         .query({stock: 'goog'})
//         .end(function(err, res){
//           assert.equal(res.status, 200);
//           assert.equal(res.body.stockData.stock, 'GOOG')
//           assert.isOk(res.body.stockData.price)
//           likes_1 = res.body.stockData.likes
//           //complete this one too
          
//           done()
//         })
//       })
      
//       test('1 stock with like', function(done) {
//         chai.request(server)
//         .get('/api/stock-prices')
//         .query({stock: 'GOOG', like: true})
//         .end(function(err, res){
//           assert.equal(res.status, 200)
//           assert.equal(res.body.stockData.stock, 'GOOG')
//           assert.isOk(res.body.stockData.price)
//           assert.equal(res.body.stockData.likes, likes_1 + 1)
//           done()
//         })
//       })
      
//       test('1 stock with like again (ensure likes arent double counted)', function(done) {
//         chai.request(server)
//         .get('/api/stock-prices')
//         .query({stock: 'GOOG', like: true})
//         .end(function(err, res){
//           assert.equal(res.status, 200)
//           assert.equal(res.body.stockData.stock, 'GOOG')
//           assert.isOk(res.body.stockData.price)
//           assert.equal(res.body.stockData.likes, likes_1 + 1)
//           done()
//         })
//       })
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['MFG', 'PAG']})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body.stockData)
          assert.equal(res.body.stockData.length, 2)
          assert.equal(res.body.stockData[0].stock, 'MFG')
          assert.equal(res.body.stockData[1].stock, 'PAG')
          likes_1 = res.body.stockData[0].likes
          likes_2 = res.body.stockData[1].likes
          done()
        })
      })
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['MFG', 'PAG'], like: true})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body.stockData)
          assert.equal(res.body.stockData.length, 2)
          assert.equal(res.body.stockData[0].stock, 'MFG')
          assert.equal(res.body.stockData[1].stock, 'PAG')
          assert.equal(res.body.stockData[0].likes, likes_1)
          assert.equal(res.body.stockData[1].likes, likes_2)
          done()
        })
      })
      
    })

})