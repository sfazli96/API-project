const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, sequelize } = require('../../db/models')
const { Op } = require("sequelize");

// const reviewValidateError = [
//     check('review')
//       .exists({ checkFalsy: true })
//       .notEmpty()
//       .withMessage('Review text is required'),
//     check('stars')
//       .exists({ checkFalsy: true })
//       .withMessage('Stars must be an integer from 1 to 5'),
//     handleValidationErrors
//   ]

// Get all of the current users bookings
// router.get('/current', requireAuth, async(req, res, next) => {

// })


module.exports = router;
