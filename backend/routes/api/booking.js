const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { Op } = require("sequelize");



// Get all of the current users bookings (I think its working)
router.get('/current', requireAuth, async(req, res, next) => {
    const userId  = req.user.id
    const bookings = await Booking.findAll({
        where: {
            userId: userId
        },
        include: {
            model: Spot,
            attributes: [
                "id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"
            ]
        },
        attributes: ["id", "spotId", "userId", "startDate", "endDate", "createdAt", "updatedAt"]
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

// Edit a Booking (fix 403 and 404 error when booking already exist)
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
    // if (endDate <= bookings.endDate) {
    //     const err = {}
    //     err.title = "Past booking can't be modified"
    //     err.status = 403;
    //     err.errors = ["Past booking can't be modified"]
    //     err.statusCode = 403
    //     next(err)
    // }

    // const checkBooking = await Booking.findByPk(req.params.bookingId)
    // console.log(checkBooking)
    // let ele = checkBooking.dataValues.startDate
    // console.log(ele)
    // // const bookDate = new Date(checkBooking.startDate.toDateString()).getTime();

    // if (Date.parse(ele) <= Date.now()) {
    //     console.log(parseInt(ele))
    //     console.log(Date.parse(ele))
    //     const err = {}
    //     err.title = "Past booking can't be modified"
    //     err.status = 403;
    //     err.errors = ["Past booking can't be modified"]
    //     err.statusCode = 403
    //     next(err)
    // }

    // for (let i = 0; i < checkBooking.length; i++) {
    //     let booking = checkBooking[i]
    //     if (booking.dataValues.startDate <= booking.dataValues.endDate) {
    //         console.log(booking.dataValues.startDate)

    //     }
    // }


    // for (let i = 0; i < checkRev.length; i++) {
    //     let rev = checkRev[i]
    //     if(rev.dataValues.userId === userId) {
    //         const err = {}
    //         err.title = 'User already has a review for this spot'
    //         err.status = 403;
    //         err.errors = ["User already has a review for this spot"]
    //         err.statusCode = 403
    //         return next(err)
    //     }
    // }
    res.json(bookings)
})

// Delete a bookings (fix 403 error)
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
    const today = new Date(new Date().toDateString()).getTime();
    console.log(today)
})


module.exports = router;
