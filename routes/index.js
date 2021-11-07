const express = require('express');
const router = express.Router();

const playerRouter = require('./player');

router.use('/players', playerRouter);

module.exports = router;