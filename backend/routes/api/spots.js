const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, sequelize } = require('../../db/models')
const { Op } = require("sequelize");
const review = require('../../db/models/review');



// Get all spots
router.get('/', async (req, res, next) => {
    // const spots = await Spot.findAll({
    //     attributes: {
    //         include: [
    //             [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]
    //         ]
    //     },
    //     include: [
    //         {
    //             model: Review,
    //             attributes: []
    //         }
    //     ],
    // })
    // res.json(spots)
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    })
    let ele = []
    spots.forEach(spot => {
        ele.push(spot.toJSON())
    });
    ele.forEach(spot => {
        spot.SpotImages.forEach(img => {
            if (img.preview === true) {
                spots.previewImage === img.url
            }
        });
        if (spots.previewImage) {
            spots.previewImage = "No Spot image found"
        }
        delete spots.previewImage
    });
    for (let i = 0; i < stars.length; i++) {
        let count = stars[i]
        let starNum = count.stars
        let length = ele.length;
        let total = sum += starNum;
        let avg = total / length

    }
    // ele.forEach(object => {
    //     let stars = object.Reviews
    //     numArr = []
    //     stars.forEach(rev => {
    //         let starNum = rev.stars
    //         console.log(starNum)
    //     });
    // });
    res.json(ele)
})


// Get all spots owned by current User
router.get('/current', requireAuth, async(req, res, next) => {
    const spots = await Spot.findOne(req.params.id)
    res.json(spots)
})

// Get details of a Spot from an id
router.get('/:spotId', async(req, res, next) => {
    const id = req.params.spotId;
    const spots = await Spot.findByPk(id, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
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
router.post('/', requireAuth, async(req, res, next) => {
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
    // if (!spots) {
    //     const err = new Error("Validation error")
    //     err.status = 400,
    //     res.json({
    //         message: err.message,
    //         statusCode: err.status
    //     })
    // }
    res.json(spots)
})

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const id = req.user.id
    const { url, preview } = req.body

    const img = await SpotImage.create({
        spotId: id,
        url,
        preview
    })
    if (!img) {
        const err = new Error("Spot couldn't be found")
        err.status = 404
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
    res.json(img)
})

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res, next) => {
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
        res.json({
            message: err.message,
            statusCode: err.status
        })
    }
    res.json(spots)
})

// Delete a spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const id = req.params.spotId
    const spots = await Spot.findByPk(id)
    await spots.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
    if (!spots) {
        next({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
})



module.exports = router;
