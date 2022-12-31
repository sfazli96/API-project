const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, sequelize } = require('../../db/models')
const { Op } = require("sequelize");


const reviewValidateError = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ]

// Get all Reviews of the current User
router.get('/current', requireAuth, async(req, res, next) => {
    const id = req.user
    const reviews = await Review.findAll({
        where: {
            userId: id.id
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            },
        ]
    })
    const spots = await Spot.findAll({
        include: {
            model: SpotImage
        }
    })
    let ele = []
    spots.forEach(element => {
        ele.push(element.toJSON())
    });
    for (let i = 0; i < ele.length; i++) {
        let spot = ele[i]
        spot.SpotImages.forEach(img => {
            if(img.preview === true) {
                reviews.forEach(element => {
                    element.Spot.dataValues.previewImage = img.url
                })
            }
        }
    )};
    res.json({
        Review: reviews
    })
})

// Add an image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const { reviewId } = req.params
    const { url } = req.body
    const revImage = await ReviewImage.create({
        reviewId: reviewId,
        url
    })
    const reviews = await Review.findByPk(reviewId)
    const revImg2 = await ReviewImage.findAll({
        where: {
            reviewId: reviewId
        },
    })
    if(!reviews) {
        const err = {}
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = ["Review couldn't be found"]
        err.statusCode = 404
        return next(err)
    }

    if (revImg2.length > 10) {
        const err = {}
        err.title = 'Maximum number of images for this resource was reached'
        err.status = 403
        err.errors = ["Maximum number of images for this resource was reached"]
        err.statusCode = 403
        return next(err)
    }

    if (req.user.id !== reviews.userId) {
        const err = {}
        err.title = 'Authorization required'
        err.status = 403
        err.errors = ["Authorization required"]
        err.statusCode = 403
        return next(err)
    }
    res.json({
        id: revImage.id,
        url: revImage.url
    })
})

// Edit a Review
router.put('/:reviewId', requireAuth, reviewValidateError, async(req, res, next) => {
    const { reviewId } = req.params
    const { review, stars } = req.body
    const reviews = await Review.findByPk(reviewId)
    if(!reviews) {
        const err = {}
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = ["Review couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (!parseFloat(stars) || stars < 1 || stars > 5) {
        const err = new Error("Validation Error")
        err.title = "Validation error"
            err.status = 400;
            err.errors = [{
                message: 'Stars must be an integer from 1 to 5'
            }]
        return next(err)
    }
    if (req.user.id !== reviews.userId) {
        const err = {}
        err.title = 'Authorization required'
        err.status = 403
        err.errors = ["Authorization required"]
        err.statusCode = 403
        return next(err)
    }
    reviews.review = review
    reviews.stars = stars
    await reviews.save()
    res.json(reviews)
})

// Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
    const id = req.params.reviewId
    const reviews = await Review.findByPk(id)
    if(!reviews) {
        const err = {}
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = ["Review couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (req.user.id !== reviews.userId) {
        const err = {}
        err.title = 'Authorization required'
        err.status = 403
        err.errors = ["Authorization required"]
        err.statusCode = 403
        return next(err)
    }
    await reviews.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
})
















module.exports = router;
