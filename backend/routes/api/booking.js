const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { Op } = require("sequelize");



// Get all of the current users bookings
router.get('/current', requireAuth, async(req, res, next) => {
    const userId  = req.user
    const bookings = await Booking.findAll({
        where: {
            userId: userId.id
        },
        include: {
            model: Spot,
            attributes: [
                "id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"
            ]
        }
    })

    const spots = await Spot.findAll({
        include: {
            model: SpotImage
        },
    })

    let ele = []
    spots.forEach(element => {
        ele.push(element.toJSON())
    });
    for (let i = 0; i < ele.length; i++) {
        let spot = ele[i]
        spot.SpotImages.forEach(img => {
            if(img.preview === true) {
                bookings.forEach(element => {
                    element.Spot.dataValues.previewImage = img.url
                })
            }
        }
    )};
    res.json({
        Bookings: bookings
    })
})

// Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const id = req.user.id
    const { startDate, endDate } = req.body
    const bookings = await Booking.findOne({
        where: {
            userId: id
        }
    })
    bookings.startDate = startDate
    bookings.endDate = endDate
    await bookings.save()
    if (endDate <= startDate) {
        const err = {}
        err.title = "endDate can't be on or before startDate"
        err.status = 400
        err.errors = ["endDate can't be on or before startDate"]
        err.statusCode = 400
        return next(err)
    }
    if(!bookings) {
        const err = {}
        err.title = 'Booking couldn\'t be found'
        err.status = 404;
        err.errors = ['Booking couldn\'t be found']
        err.statusCode = 404
        next(err)
    }
    res.json(bookings)
})

// Delete a bookings
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingId
    const bookings = await Booking.findByPk(id)
    if(!bookings) {
        const err = {}
        err.title = 'Booking couldn\'t be found'
        err.status = 404;
        err.errors = ['Booking couldn\'t be found']
        err.statusCode = 404
        next(err)
    } else {
        await bookings.destroy()
        res.json({
            statusCode: 200,
            message: "successfully deleted"
        })
    }
})


module.exports = router;
