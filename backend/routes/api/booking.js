const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { SpotImage, User, Spot, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { Op } = require("sequelize");



// Get all of the current users bookings
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

// Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
    const id = req.user.id
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const newStartDate = new Date(startDate).toISOString().slice(0, 10)
    const newEndDate = new Date(endDate).toISOString().slice(0, 10)
    const checkBooking = await Booking.findByPk(req.params.bookingId)
    const bookings = await Booking.findOne({
        where: {
            id: bookingId
        }
    })
    if(!checkBooking) {
        const err = {}
        err.title = 'Booking couldn\'t be found'
        err.status = 404;
        err.errors = ['Booking couldn\'t be found']
        err.statusCode = 404
        return next(err)
    }
    if (endDate <= startDate) {
        const err = {}
        err.title = "endDate can't be on or before startDate"
        err.status = 400
        err.errors = ["endDate can't be on or before startDate"]
        err.statusCode = 400
        return next(err)
    }

    if (bookings.userId !== id) {
        const err = {}
        err.title = "You are not allowed to edit this booking"
        err.status = 403
        err.errors = ["You are not allowed to edit this booking"]
        err.statusCode = 403
        return next(err)
    }


    const conflictBooking = await Booking.findAll({
        where: {
            spotId: bookings.spotId,
            userId: {
                [Op.ne]: id
            },
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

    // if (bookings.dataValues.endDate <= endDate) {
    //     const err = {}
    //     err.title = "Past bookings can't be modified"
    //     err.status = 403;
    //     err.errors = ["Past bookings can't be modified"]
    //     err.statusCode = 403
    //     return next(err)
    // }

    if (Date.parse(startDate) <= Date.now()) {
        const err = {}
        err.title = "Past bookings can't be modified"
        err.status = 403;
        err.errors = ["Past bookings can't be modified"]
        err.statusCode = 403
        return next(err)
    }

    bookings.startDate = startDate
    bookings.endDate = endDate
    await bookings.save()
    res.json(bookings)
})

// Delete a bookings
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const id = req.params.bookingId
    const bookings = await Booking.findByPk(id)
    const startDate = new Date().toISOString().slice(0, 10)
    if(!bookings) {
        const err = {}
        err.title = 'Booking couldn\'t be found'
        err.status = 404;
        err.errors = ['Booking couldn\'t be found']
        err.statusCode = 404
        return next(err)
    }
    if (bookings.dataValues.startDate <= startDate) {
        const err = {}
        err.title = "Bookings that have been started can't be deleted"
        err.status = 403;
        err.errors = ["Bookings that have been started can't be deleted"]
        err.statusCode = 403
        return next(err)
    }
    if (req.user.id !== bookings.userId) {
        const err = {}
        err.title = "Authorization Error"
        err.status = 403;
        err.errors = ["Authorization Error"]
        err.statusCode = 403
        return next(err)
    }
    await bookings.destroy()
    res.json({
        statusCode: 200,
        message: "successfully deleted"
    })
})


module.exports = router;
