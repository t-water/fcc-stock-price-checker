const MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.DB;

exports.getLikes = function(stock, callback){
  MongoClient.connect(CONNECTION_STRING, (err, db) => {
    if(err){
      callback(err)
    }else{
      const col = db.db('fcc_stocks').collection(stock)
      col.count({ip: {$exists: true}})
      .then(count => {
        callback(count)
      }, err => callback(err))
      .catch(err => callback(err))
    }
  })
}

exports.addLike = function(stock, ip, callback){
   MongoClient.connect(CONNECTION_STRING, (err, db) => {
    if(err){
      callback(err)
    }else{
      let address = {}
      address["ip"] = ip
      const col = db.db('fcc_stocks').collection(stock)
      col.update(address, address, {upsert: true})
      .then(update => {
        col.count({ip: {$exists: true}})
          .then(count => {
            callback(count)
          }, err => callback(err))
          .catch(err => callback(err))
      })
    }
  })
}

exports.compareLikes = function(stockObject, callback){
  MongoClient.connect(CONNECTION_STRING, (err, db) =>{
    if(err){
      callback(err)
    }else{
      const col = db.db('fcc_stocks').collection(stockObject['stockData'][0]['stock'])
      col.count({"ip": {$exists: true}})
      .then(count1 => {
        stockObject['stockData'][0]['likes'] = count1;
        const col2 = db.db('fcc_stocks').collection(stockObject['stockData'][1]['stock'])
        col2.count({"ip": {$exists: true}})
        .then(count2 => {
          stockObject['stockData'][0]['likes'] = count2
          callback(stockObject)
        }, err => callback(err))
        .catch(err => callback(err))
      }, err => callback(err))
      .catch(err => callback(err))
    }
  })
}