/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res, next){
      let stock = req.query.stock.toUpperCase();
      let like = req.query.like;
      if(!stock || stock === ''){
        res.statusCode = 404;
        let err = new Error('Stock not found');
        return next(err);
      }
    });
    
};
