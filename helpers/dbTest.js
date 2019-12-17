#!/usr/bin/env node

exports.test = (mongoose) => {
  function log() {
    console.dir(arguments);
  }

  const opts = { useNewUrlParser: true, useUnifiedTopology: true };

  //const mongoose = require('mongoose');
  console.log(`VERSION: ${mongoose.version}`);
  const ver = mongoose.version.charAt(0);
  const conn = mongoose.connection;
  const Schema = mongoose.Schema;

  if (ver < 5) {
    opts.useMongoClient = true;
    mongoose.Promise = global.Promise;
  }
  // doesnt create the db immediately, only when you add sth to it
  mongoose.connect('mongodb://localhost/kurak', opts);

  const schema = new Schema({
    name: String
  });
  const Test = mongoose.model('test', schema);
  const test = new Test({ name: 'test' });

  async function run() {
    await conn.dropDatabase();
    await test.save();
    mongoose.set('debug', log);
    const count = await Test.find({ _id: test._id }).countDocuments();
    if (count === 1) {
      console.log('---- Mongo test passed ---- objects found: ' + count);
    } else {
      console.log('---- MONGO TEST FAILED ---- objects found: ' + count);
      console.log('---- !!! CLOSING the connection to mongo !!! --------');
      return conn.close();
    }
  }

  run();
};

module.exports = exports;
