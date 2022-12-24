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

// Get all Reviews of the current User (need to finish, previewImage is missing)
router.get('/current', requireAuth, async(req, res, next) => {
    const id = req.user.id
    const reviews = await Review.findOne({
        where: {
            userId: id
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
                model: ReviewImage
            }

        ]
    })
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

// Add an image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
    const { reviewId } = req.params
    const { url } = req.body
    const revImage = await ReviewImage.create({
        reviewId: reviewId,
        url
    })
    const reviews = await Review.findByPk(reviewId)
    if(!reviews) {
        const err = {}
        err.title = 'Review couldn\'t be found'
        err.status = 404;
        err.errors = ["Review couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    res.json({
        id: revImage.id,
        url: revImage.url
    })
})

// Edit a Review
router.put('/:reviewId', requireAuth, reviewValidateError, async(req, res, next) => {
    // const id = req.user.id
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
        next(err)
    }
    await reviews.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
})
















module.exports = router;
