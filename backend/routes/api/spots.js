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
    // const spots = await Spot.findAll()
    const spots = await Spot.findAll({
        attributes: {
            include: [
                [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"]
            ]
        },
        include: [
            {
                model: Review,
                attributes: []
            }
        ],
    })
    res.json(spots)
    // const spots = await Spot.findAll({
    //     include: [
    //         {
    //             model: Review
    //         },
    //         {
    //             model: SpotImage
    //         }
    //     ]
    // })
    // let ele = []
    // spots.forEach(spot => {
    //     ele.push(spot.toJSON())
    // });
    // ele.forEach(spot => {
    //     spot.SpotImages.forEach(img => {
    //         if (img.preview === true) {
    //             spot.previewImage === img.url
    //         }
    //     });
    // });

    // ele.forEach(object => {
    //     let stars = object.Reviews
    //     stars.forEach(rev => {
    //         let num = rev.stars
    //         let sum = 0
    //         let total = sum += num
    //         let average = total / ele.length
    //     });
    // });
    // res.json(ele)
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

// // Create a Spot
// router.post('/', requireAuth, async(req, res, next) => {
//     const spotBody = req.body
// })


module.exports = router;
