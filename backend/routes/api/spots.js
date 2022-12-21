const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage } = require('../../db/models')
const { User } = require('../../db/models');



// Get all spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll()
    res.json(spots)
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
