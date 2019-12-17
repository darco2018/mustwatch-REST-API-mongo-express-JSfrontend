const express = require('express');
var Movie = require('../models/movie');

/* THREE ways of making requests */
// 1. then/catch with promises
exports.getMovies = (req, res) => {
  const movies = [];
  Movie.find()
    .then(movies => res.json({ movies }))
    .catch(err => res.json(err));
};

// 2. callback
exports.postMovie = (req, res) => {
  Movie.create(req.body, (err, saved) => {
    if (err) {
      res.json(err);
    }
    res.json(saved);
  });
};

// 3. async/await
exports.getMovie = async (req, res) => {
  try {
    const found = await Movie.findOne({ _id: req.params.id });
    res.json(found);
  } catch (error) {
    res.json(error);
  }
};

exports.putMovie = (req, res) => {
  Movie.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then(found => res.json(found))
    .catch(err => res.json(err));
};

exports.deleteMovie = (req, res) => {
  Movie.deleteOne({ _id: req.params.id })
    .then(() => res.json('Movie deleted'))
    .catch(err => res.json(err));
};
module.exports = exports;
