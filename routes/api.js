'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const fetch = require('node-fetch');
const ip = require('ip');
const likeController = require('../controllers/likeController')

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){    
      async function getStockInfo(url){
        let result = await fetch(url)
        let jsonResult = await result.json();
        return jsonResult
      }
    
      let baseUrl = 'https://repeated-alpaca.glitch.me';
      let stock = req.query.stock
      let like = req.query.like;
      
      
      if(Array.isArray(stock)){
        let stockUrls = stock.map(x => `/v1/stock/${x}/quote`)
        var stockObject = {stockObject: []}
        async function buildStockObject(){
          let stock1 = await getStockInfo(baseUrl + stockUrls[0])
          stockObject['stockObject'].push({"stock": stock1.symbol, "price": stock1.latestPrice});
          let stock2 = await getStockInfo(baseUrl + stockUrls[1]);
          stockObject['stockObject'].push({"stock": stock2.symbol, "price": stock2.latestPrice});
        }
        buildStockObject()
        .then(result => {res.json(stockObject)
        }, err => next(err))
        .catch(err => next(err))
      }
      
      else if(stock && stock !== ''){
        let url = `/v1/stock/${stock}/quote`;

        getStockInfo(baseUrl + url)
        .then(result => {
          async function buildLikeObject(like){
            if(like){
              return await likeController.addLike(result.symbol, (data) =>{
               res.json({"stock": result.symbol, "price": result.latestPrice, "likes": data})
              })
              return await likeController.getLikes(result.symbol, (data) =>{
               res.json({"stock": result.symbol, "price": result.latestPrice, "likes": data})
              })
            }
          }
        }, err => next(err))
        .catch(err => next(err))
      }
    
      else{
        res.statusCode = 404;
        let err = new Error('No Stock Given');
        return next(err);
      }
    });
};
