'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const fetch = require('node-fetch');
const ip = require('ip');

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){    
      async function getStockInfo(url){
        let result = await fetch(url)
        let jsonResult = await result.json()
        return jsonResult
      }
    
      let baseUrl = 'https://repeated-alpaca.glitch.me';
      let stock = req.query.stock
      let like = req.query.like;
      
      
      if(Array.isArray(stock)){
        let stockObject = stock.map(x => {
          let url = `/v1/stock/${x}/quote`;          
          getStockInfo(baseUrl + url)
          .then(result => {
            return "this"
          }, err => next(err))
          .catch(err => next(err))
        })
        res.json(stockObject);
      }
      else if(stock && stock !== ''){
        let url = `/v1/stock/${stock}/quote`;

        getStockInfo(baseUrl + url)
        .then(result => {
          res.json(result)
        }, err => next(err))
        .catch(err => next(err))
      }else{
        res.statusCode = 404;
        let err = new Error('No Stock Given');
        return next(err);
      }
    });
};
