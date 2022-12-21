const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');





router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll()
    res.json(spots)
})


// router.get('/api/spots/current', requireAuth, async(req, res, next) => {

// })




module.exports = router;
