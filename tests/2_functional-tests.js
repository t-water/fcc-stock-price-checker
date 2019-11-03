var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('Routing Tests', function() {
    suite('GET /api/stock-prices => stockData object', function() {
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'fb'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stock');
          assert.property(res.body, 'price');
          assert.property(res.body, 'likes');
          assert.equal(res.body.stock, 'FB');
          done();
        });
      });
      
      var likes = '';
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'fb', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stock');
          assert.property(res.body, 'price');
          assert.property(res.body, 'likes');
          assert.equal(res.body.stock, 'FB');
          assert.isAbove(res.body.likes, 0);
          likes = res.body.likes;
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'fb', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body, 'stock');
          assert.property(res.body, 'price');
          assert.property(res.body, 'likes');
          assert.equal(res.body.stock, 'FB');
          assert.equal(res.body.likes, likes);
          done();
        });
      });
            
      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['fb','goog']})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.oneOf(res.body.stockData[0].stock, ['FB','GOOG']);
          assert.oneOf(res.body.stockData[1].stock, ['FB','GOOG']);
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['fb','goog'], like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body.stockData[0], 'stock');
          assert.property(res.body.stockData[0], 'price');
          assert.property(res.body.stockData[0], 'likes');
          assert.property(res.body.stockData[1], 'stock');
          assert.property(res.body.stockData[1], 'price');
          assert.property(res.body.stockData[1], 'likes');
          assert.oneOf(res.body.stockData[0].stock, ['FB','GOOG']);
          assert.oneOf(res.body.stockData[1].stock, ['FB','GOOG']);
          done();
        });
      });
    });
  });
});
