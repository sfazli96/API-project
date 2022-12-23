const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, sequelize } = require('../../db/models')
const { Op } = require("sequelize");

// Get all Reviews of the current User (need to finish)
router.get('/current', requireAuth, async(req, res, next) => {
    const id = req.user.id
    const reviews = await Spot.findOne({
        where: {
            ownerId: id
        },
        include: [
            {
                model: Review
            }
        ]
    })
    // const reviews = await Review.findAll({
    //     include: [
    //         {
    //             model: User,
    //             attributes: ['id', 'firstName', 'lastName']
    //         },
    //         {
    //             model: Spot,
    //             attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
    //         },
    //         {
    //             model: ReviewImage,
    //             attributes: ['id', 'url']
    //         }
    //     ]
    // })
    // const everyReview = []
    // let reviewEle = []
    // reviews.forEach(ele => {
    //     reviewEle.push(ele.toJSON())
    // })
    // reviewEle.forEach(rev => {
    //     rev.Spot.SpotImage.forEach(img => {
    //         if (!img.preview) {
    //             rev.Spot.previewImage = "No preview image is available"
    //         }

    //         if (img.preview) {
    //             rev.Spot.previewImage = img.url
    //         }
    //     })
    //     delete rev.Spot.SpotImage
    //     everyReview.push(rev)
    // });
    // return res.json({
    //     Review: everyReview
    // })
    res.json(reviews)
})

// Add an image toa Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    
})


















module.exports = router;