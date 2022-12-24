const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { INTEGER, DATE } = require('sequelize');


// router.delete('/:imageId', requireAuth, async(req, res, next) => {
//     const { imageId } = req.params
//     const images = await SpotImage.findByPk(imageId)
//     console.log(images)

//    if(!images) {
//     const err = new Error('Image does not exist')
//     err.title = 'Image couldn\'t be found'
//     err.status = 404
//     err.error = [{
//         message: "Image couldn't be found",
//         statusCode: 404
//     }]
//     return next(err)
//    }
//    await images.destroy()
//    res.json(({
//         message: "Successfully deleted",
//         statusCode: 200
//    }))
// })

module.exports = router;
