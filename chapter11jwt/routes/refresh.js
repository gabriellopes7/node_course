const express = require('express')
const router = express.Router()
const regreshTokenController = require('../controllers/refreshTokenController')

router.get('/', regreshTokenController.handleRefreshToken)

module.exports = router