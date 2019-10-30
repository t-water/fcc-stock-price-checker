const MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.DB;

exports.getLikes = function(stock, callback){
  MongoClient.connect(CONNECTION_STRING, (err, db) => {
    if(err){
      return err
    }
    const col = db.db('fcc_stocks').collection(stock)
    col.count({ip: {$exists: true}})
    .then(count => {
      callback(count)
    }, err => err)
    .catch(err => err)
  })
}

exports.addLike = function(stock, ip, callback){
   MongoClient.connect(CONNECTION_STRING, (err, db) => {
    if(err){
      return err
    }
    let address = {}
    address["ip"] = ip
    const col = db.db('fcc_stocks').collection(stock)
    col.update(address, address, {upsert: true})
    .then(update => {
      col.count({ip: {$exists: true}})
        .then(count => {
          callback(count)
        }, err => err)
        .catch(err => err)
    })
    
  })
}