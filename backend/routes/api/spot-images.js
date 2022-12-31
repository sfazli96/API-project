const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const imageId = req.params.imageId
    const images = await SpotImage.findByPk(imageId)
    if(!images) {
        const err = new Error('Image does not exist')
        err.title = 'Spot Image couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Spot Image couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
    const spot = await Spot.findAll()
    let ownerId;
    spot.forEach(element => {
        ownerId = element.ownerId
    });
    if (req.user.id !== ownerId) {
        const err = {}
        err.title = "Authorization Error"
        err.status = 403;
        err.errors = ["Authorization Error"]
        err.statusCode = 403
        return next(err)
    }
   await images.destroy()
   res.json(({
        message: "Successfully deleted",
        statusCode: 200
   }))
})

module.exports = router;
