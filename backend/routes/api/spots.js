const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, sequelize } = require('../../db/models')
const { Op } = require("sequelize");
const review = require('../../db/models/review');

const validateSpotError = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('City is required'),
    check('country')
      .not()
      .notEmpty()
      .withMessage('Country is required'),
    check('lat')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Latitude is not valid'),
    check('lng')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Longitude is not valid'),
    check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
    check('price')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Price per day is required'),
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters'),
  ];

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


// Get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        group: ["Spot.id", "Reviews.id", "SpotImages.SpotId"]
    })

    let ele = []
    spots.forEach(spot => {
        ele.push(spot.toJSON())
    })

    for (let i = 0; i < ele.length; i++) {
        let spot = ele[i]

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                // include: [
                //     [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
                // ],
                attributes: ["stars"],
                raw: true
            },
        })
        // spot.avgRating = reviews[0].dataValues.avgRating
        spot.SpotImages.forEach(img => {
            if(img.preview === true) {
                spot.previewImage = img.url
            }
        })
        let countRating = 0
        spot.Reviews.forEach(element => {
            // spot.avgRating = element.stars
            countRating += element.stars
        });
        let average = countRating / reviews.length
        if(!spots.previewImage) {
            spots.previewImage = 'no image found'
        }
        else {
            spot.avgRating = average
        }
        if (!spot.avgRating) {
            spot.avgRating = "no reviews are found"
        }
        delete spot.SpotImages
        delete spot.Reviews
    }
    res.json({
        Spots: ele
    })
})


// Get all spots owned by current User
router.get('/current', requireAuth, async(req, res, next) => {
    // const spots = await Spot.findOne(req.params.id)
    // res.json(spots)
    const id = req.user.id
    const spots = await Spot.findAll({
        where: {
            ownerId: id
        },
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        group: ["Spot.id", "Reviews.id", "SpotImages.id"]
    })

    let ele = []
    spots.forEach(spot => {
        ele.push(spot.toJSON())
    })

    for (let i = 0; i < ele.length; i++) {
        let spot = ele[i]

        const reviews = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: {
                // include: [
                //     [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"]
                // ],
                attributes: ["stars"],
                raw: true
            },

        })
        // spot.avgRating = reviews[0].dataValues.avgRating
        spot.SpotImages.forEach(img => {

            if(img.preview === true) {
                spot.previewImage = img.url
            }
        })
        let countRating = 0
        spot.Reviews.forEach(element => {
            // spot.avgRating = element.stars
            countRating += element.stars
        });
        let average = countRating / reviews.length
        if(!spots.previewImage) {
            spots.previewImage = 'no image found'
        }
        else {
            spot.avgRating = average
        }
        if (!spot.avgRating) {
            spot.avgRating = "no reviews are found"
        }
        delete spot.SpotImages
        delete spot.Reviews
    }
    res.json({
        Spots: ele
    })
})

// Get details of a Spot from an id (error handling is working)
router.get('/:spotId', async(req, res, next) => {
    const id = req.params.spotId;
    const spots = await Spot.findByPk(id, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
                as: "SpotImages"
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: "Owner"
            }
        ]
    })
    if (!spots) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
    res.json(spots)
})

// Create a Spot
router.post('/', requireAuth, validateSpotError, async(req, res, next) => {
    const id = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const spots = await Spot.create({
        ownerId: id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    res.json(spots)
})

// Add an Image to a Spot based on the Spot's id (error handling is working)
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // const id = req.user.id
    const { spotId } = req.params
    const { url, preview } = req.body
    const spots = await Spot.findByPk(spotId)
    if (!spots) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
    const img = await SpotImage.create({
        spotId: spotId,
        url,
        preview
    })
    res.json({
        id: img.id,
        url: img.url,
        preview: img.preview
    })
})

// Edit a Spot (error handling is not working)
router.put('/:spotId', requireAuth, validateSpotError, async (req, res, next) => {
    const id = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spots = await Spot.findOne({
        where: {
            ownerId: id
        }
    })
    spots.address = address
    spots.city = city
    spots.state = state
    spots.country = country
    spots.lat = lat
    spots.lng = lng
    spots.name = name
    spots.description = description
    spots.price = price
    await spots.save()
    if (!spots) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
    }
    res.json(spots)
})

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const id = req.params.spotId
    const spots = await Spot.findByPk(id)
    if (!spots) {
        next({
            title: "Spot couldn't be found",
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    await spots.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
})

// Get all Reviews by a Spot's id (empty array for when we are in incorrect reviews)
router.get('/:spotId/reviews', async (req,res, next)=> {
    const { spotId } = req.params

    const reviews = await Spot.findAll({
        where: {
            id: spotId
        },
        include: [
        {
            model: Review,
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"],
                    as: "User"
                },
                {
                    model: ReviewImage,
                    attributes: ["id", "url"],
                }
            ]
        },

    ]
    })
    const spot = await Spot.findByPk(spotId)
    if(!spot) {
        const err = new Error('Spot does not exist')
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = [{
            message: "Spot couldn't be found",
            statusCode: 404
        }]
    }
    res.json(reviews)
})

// Create a Review for a Spot based on the Spot's id (super close, fix 400 error integer min 1 to max 5, validation on top)
router.post('/:spotId/reviews', requireAuth, reviewValidateError, async(req, res, next) => {
    // const spotId = req.user.id
    const { spotId } = req.params
    const userId = req.user.id
    const { review, stars } = req.body
    const spots = await Spot.findByPk(spotId)

    if (!spots) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
    const reviewCheck = await Review.findAll()
    reviewCheck.forEach(review => {
        if(review.dataValues.userId === userId){
            const err = new Error('User already has a review for this spot')
            err.title = 'User already has a review for this spot'
            err.status = 403;
        err.errors = [{
            message: "User already has a review for this spot",
            statusCode: 403
        }]
    return next(err)
        }
    })
    const reviewComment = await Review.create({
        userId,
        spotId,
        review,
        stars
    })

    res.json({reviewComment})
})







module.exports = router;
