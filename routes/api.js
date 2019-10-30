'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
const fetch = require('node-fetch');
const ip = require('ip');

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){
      let baseUrl = 'https://repeated-alpaca.glitch.me';
      let stock = req.query.stock
      let like = req.query.like;
      
      if(Array.isArray(stock)){
        res.json(stock)
      }
      else if(stock && stock !== ''){
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
        .then(response => response.json())
        .then(response => {
          MongoClient.connect(CONNECTION_STRING, (err, db) => {
            if(err){
              next(err)
            }else{
              const col = db.db('fcc_stocks').collection(response.symbol);
              if(like === 'true'){
                let insertedIP = {}
                insertedIP['ip'] = ip.address();
                col.findOne(insertedIP)
                .then(data => {
                  if(data != null){
                    col.count({"ip": {$exists: true}})
                      .then(count => {
                        res.json({"stockData": {"symbol": response.symbol, "price": response.latestPrice, "likes": count}})
                      },err => next(err))
                      .catch(err => next(err))
                  }else{
                    col.insertOne(insertedIP)
                    .then(data => {
                      col.count({"ip": {$exists: true}})
                      .then(count => {
                        res.json({"stockData": {"symbol": response.symbol, "price": response.latestPrice, "likes": count}})
                      },err => next(err))
                      .catch(err => next(err))
                    }, err => next(err))
                    .catch(err => next(err))
                      }
                    }, err=>next(err))
                    .catch(err => next(err))

              }else{
                col.count({"ip": {$exists: true}})
                .then(count => res.json({"stockData": {"symbol": response.symbol, "price": response.latestPrice, "likes": count}}),
                     err => next(err))
                .catch(err => next(err))
                }
            }
          })          
        })
        .catch(err => next(err))
      }else{
        res.statusCode = 404;
        let err = new Error('No Stock Given');
        return next(err);
      }
    });
    
};
