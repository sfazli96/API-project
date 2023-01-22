const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
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
    handleValidationErrors
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

  const validateQueryError = [
    check('page')
      .exists({ checkFalsy: true })
      .optional()
      .isInt({ min: 1})
      .withMessage('Page must be greater than or equal to 1'),
    check('size')
      .exists({ checkFalsy: true })
      .optional()
      .isInt({ min: 1})
      .withMessage('Size must be greater than or equal to 1'),
    check('minLat')
      .exists({ checkFalsy: true })
      .isDecimal()
      .optional()
      .withMessage('Minimum latitude is invalid'),
    check('maxLat')
      .exists({ checkFalsy: true })
      .isDecimal()
      .optional()
      .withMessage('Maximum latitude is invalid'),
    check('minLng')
      .exists({ checkFalsy: true })
      .isDecimal()
      .optional()
      .withMessage('Minimum longitude is invalid'),
    check('maxLng')
      .exists({ checkFalsy: true })
      .isDecimal()
      .optional()
      .withMessage('Maximum longitude is invalid'),
    check('minPrice')
      .exists({ checkFalsy: true })
    //    (add a isFloat maybe)
      .optional()
      .isInt({min: 0})
      .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
      .exists({ checkFalsy: true })
    //    (add a isFloat maybe)
      .optional()
      .isInt({min: 0})
      .withMessage('Maximum price must be greater than or equal to 0'),
    handleValidationErrors
  ]

// Get all spots
router.get('/', validateQueryError, async (req, res, next) => {
    let {page, size, maxLat, minLat, maxLng, maxPrice, minPrice} = req.query
    if (!page) page = 1;
    if (!size) size = 200;

    size = parseInt(size)
    page = parseInt(page)
    maxPrice = parseInt(maxPrice)
    minPrice = parseInt(minPrice)
    maxLat = parseInt(maxLat)
    minLat = parseInt(minLat)
    maxLng = parseInt(maxLng)

    const pagination = {}
    if (page >= 1 && size >= 1) {
        pagination.limit = size
        pagination.offset = size * (page - 1)
    }

    let optionalParameter = {
        where: {}
    }

    if (maxPrice) {
        optionalParameter.where.price = {
            [Op.lte]: maxPrice
        }
    }

    if (minPrice) {
        optionalParameter.where.price = {
            [Op.gte]: minPrice
        }
    }

    if (maxLat) {
        optionalParameter.where.lat = {
            [Op.lte]: maxLat
        }
    }

    if (minLat) {
        optionalParameter.where.lat = {
            [Op.gte]: minLat
        }
    }





    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ],
        // group: ["Spot.id", "Reviews.id", "SpotImages.id"],
        // ...pagination,
        where: optionalParameter.where,
        limit: pagination.limit,
        offset: pagination.offset
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
        Spots: ele,
        page,
        size
    })
})


// Get all spots owned by current User
router.get('/current', requireAuth, async(req, res, next) => {
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

// Get details of a Spot from an id
router.get('/:spotId', async(req, res, next) => {
    const id = req.params.spotId;
    const ownerId = req.user.id
    const spots = await Spot.findByPk(id, {
        raw: true
    })

    if(!spots) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }

    const userOwner = await User.findOne({
        where: {
            id: ownerId
        },
        model: User,
        attributes: ["id", "firstName", "lastName"],
    })
    spots.Owner = userOwner

    const reviews = await Review.findAll({
        where: {
            spotId: spots.id,
        },
        attributes: ["stars", "review"],
        raw: true
    })
    let avgStarCount = 0
    let total = reviews.length
    reviews.forEach(rating => {
        avgStarCount += rating.stars
    })

    spots.numReviews = total
    spots.avgStarRating = avgStarCount / total
    const spot_image = await SpotImage.findAll({
        where: {
            spotId: spots.id,
            preview: true
        },
        attributes: ["id", "url", "preview"]
    })

    spots.SpotImages = spot_image
    if (!spots.avgStarRating) {
        spots.avgStarRating = "No reviews yet"
    }
    if (!spots.numReviews) {
        spots.numReviews = "No reviews yet"
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
    if (spots) {
        res.status(201)
        res.json(spots)
    }

})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    // const id = req.user.id
    const { spotId } = req.params
    const { url, preview } = req.body
    const spots = await Spot.findByPk(spotId)
    if(!spots) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (req.user.id !== spots.ownerId) {
        const err = {}
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = {
            message: "Forbidden"
        }
        err.statusCode = 403
        return next(err)
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

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpotError, async (req, res, next) => {
    const id = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.findByPk(req.params.spotId)
    if(!spot) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (id !== spot.ownerId) {
        const err = {}
        err.title = 'Require proper authorization'
        err.status = 403;
        err.errors = {
            message: "Forbidden"
        }
        err.statusCode = 403
        return next(err)
    }
    spot.address = address
    spot.city = city
    spot.state = state
    spot.country = country
    spot.lat = lat
    spot.lng = lng
    spot.name = name
    spot.description = description
    spot.price = price
    await spot.save()
    res.json(spot)
})

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const id = req.params.spotId
    const spots = await Spot.findByPk(id)
    if(!spots) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (req.user.id !== spots.ownerId) {
        const err = {}
        err.title = 'Require proper authorization'
        err.status = 404;
        err.errors = ['Require proper authorization']
        err.statusCode = 404
        return next(err)
    }
    await spots.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
})

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res, next)=> {
    const { spotId } = req.params


    const reviews = await Review.findAll({
        where: {
            spotId: spotId
        },
            include: [
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"],
                    as: "User"
                },
                {
                    model: ReviewImage,
                    attributes: ["id", "url"]
                }
        ]
    })

    const spot = await Spot.findByPk(spotId)
    if(!spot) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }

    res.json({
        Review: reviews
    })
})

// Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, reviewValidateError, async(req, res, next) => {
    const { spotId } = req.params
    const userId = req.user.id
    const { review, stars } = req.body
    const spots = await Spot.findByPk(spotId)
    if(!spots) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
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

    const checkRev = await Review.findOne({
        where: {
            userId,
            spotId
        }
    })
    if (checkRev) {
        const err = {}
        err.title = 'User already has a review for this spot'
        err.status = 403;
        err.errors = ["User already has a review for this spot"]
        err.statusCode = 403
        return next(err)
    }
    const reviewComment = await Review.create({
        userId,
        spotId: parseInt(spotId),
        review,
        stars
    })

    if (reviewComment) {
        res.status(201)
        res.json(reviewComment)
    }
})

// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const { spotId } = req.params
    const spot = await Spot.findByPk(spotId)
    if(!spot) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    let bookings;
    // If I am the owner of the spot
    if (userId === spot.ownerId) {
        bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            // attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"],
            // include: [
            //     {
            //         model: User,
            //         attributes: ["id", "firstName", "lastName"]
            //     }
            // ]
            attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"],
            include: [
                {
                    model: User,
                    attributes: {
                        exclude: ["username", "hashedPassword", "email", "createdAt", "updatedAt"]
                    }
                },
            ],
        })
    }
    // If i am NOT the owner of the spot
    if (userId !== spot.ownerId) {
        bookings = await Booking.findAll({
            where: {
                spotId: spotId
            },
            attributes: ["spotId", "startDate", "endDate"]
        })
    }
    return res.json({
        Booking: bookings
    })
})




// Create a Booking from a Spot based on Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const userId = req.user.id
    const { spotId } = req.params
    const { startDate, endDate } = req.body
    const newStartDate = new Date(startDate).toISOString().slice(0, 10)
    const newEndDate = new Date(endDate).toISOString().slice(0, 10)
    const spots = await Spot.findByPk(spotId)
    if(!spots) {
        const err = {}
        err.title = 'Spot couldn\'t be found'
        err.status = 404;
        err.errors = ["Spot couldn't be found"]
        err.statusCode = 404
        return next(err)
    }
    if (newEndDate <= newStartDate) {
        const err = {}
        err.title = "endDate can't be on or before startDate"
        err.status = 400
        err.errors = ["endDate can't be on or before startDate"]
        err.statusCode = 400
        return next(err)
    }
    if (req.user.id === spots.ownerId) {
        const err = {}
        err.title = "Spot must NOT belong to the current user"
        err.status = 403
        err.errors = ["Authorization required"]
        err.statusCode = 403
        return next(err)
    }

    const conflictBooking = await Booking.findAll({
        where: {
            spotId: spotId,
            [Op.or]: [
                {
                  startDate: {
                    [Op.lt]: newEndDate,
                  },
                  endDate: {
                    [Op.gt]: newStartDate,
                  },
                },
                {
                  startDate: {
                    [Op.gt]: newStartDate,
                  },
                  endDate: {
                    [Op.lt]: newEndDate,
                  },
                },
                {
                  startDate: {
                    [Op.lt]: newStartDate,
                  },
                  endDate: {
                    [Op.gt]: newEndDate,
                  },
              },
              ],
        }
    })
    let eleConflictBooking = false
    for (let i = 0; i < conflictBooking.length; i++) {
        let conflictBooked = conflictBooking[i]
            if ((newStartDate <= conflictBooked.startDate && newEndDate >= conflictBooked.endDate) ||(newEndDate > conflictBooked.startDate && newEndDate <= conflictBooked.endDate) || (newStartDate >= conflictBooked.startDate && newStartDate < conflictBooked.endDate)) {
                eleConflictBooking = true
            }
        }

    if (eleConflictBooking === true) {
        const err = new Error('Validation Error')
        err.title = 'Sorry, this spot is already booked for the specified dates'
        err.status = 403;
        err.errors = {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking"
        }
        return next(err)
    }
    const creatingBookings = await Booking.create({
        userId: userId,
        spotId: parseInt(spotId),
        startDate,
        endDate
    })
    res.json({
        id: creatingBookings.id,
        userId: creatingBookings.userId,
        spotId: creatingBookings.spotId,
        startDate: creatingBookings.startDate,
        endDate: creatingBookings.endDate,
        createdAt: creatingBookings.createdAt,
        updatedAt: creatingBookings.updatedAt
    })
})






module.exports = router;
