var express = require('express');
var mongoose = require('mongoose');

// _id field by default 
const movieSchema = new mongoose.Schema({
  title: { type: String, default: 'No title', trim: true, required: true },
  genre: { type: String, default: 'Not specified', trim: true },
  released: { type: Number },
  isWatched: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Movie', movieSchema);

/* 
   for postman or for db.movies.insertMany([.....])
    {"title": "Superman", "genre": "fantasy", "released": 2008, "isWatched": false, "rating": 0} 	
    {"title": "Star Wars", "genre": "sci-fi", "released": 1985, "isWatched": false, "rating": 0} 	
    {"title": "Thieves", "genre": "drama", "released": 2017, "isWatched": false, "rating": 0}  
 */
