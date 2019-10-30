'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){
      let baseUrl = 'https://repeated-alpaca.glitch.me';
      let stock = req.query.stock
      let like = req.query.like;
      let stockData = {stockData: ''};
      
      if(Array.isArray(stock)){
        res.json(stock)
      }else{
        if(like === 'true'){
          res.json('like');
        }else{
          let url = `/v1/stock/${stock}/quote`
          return fetch(baseUrl + url)
          .then(response => {
            if(response.ok){
              return response
            }else{
              let err = new Error('Response returned not ok');
              err.response = response;
              throw err;
            }
          }, error => {
            let err = new Error(error.message);
            throw err;
          })
        }
      }
      // if(!stock || stock === ''){
      //   res.statusCode = 404;
      //   let err = new Error('Stock not found');
      //   return next(err);
      // }else{
      //   res.json(stock);
      // }
    });
    
};
