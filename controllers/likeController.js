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

exports.addLike = function(){
  
}