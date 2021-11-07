const express = require('express');
const auth = require('../middlewares/auth');
const playerController = require('../controllers/playerController');

const router = express.Router();

router.get('/:license', auth.authenticate, playerController.getByLicense);

module.exports = router;