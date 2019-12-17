var express = require('express');
var router = express.Router();
var Movie = require('../models/movie');
var movieContr = require('../contollers/movie');

router.get('/', movieContr.getMovies);
router.post('/', movieContr.postMovie);
router.get('/:id', movieContr.getMovie);
router.put('/:id', movieContr.putMovie);
router.delete('/:id', movieContr.deleteMovie);

module.exports = router;
