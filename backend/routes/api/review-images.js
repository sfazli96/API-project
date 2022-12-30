const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const reviewImageId = req.params.imageId
    const reviewImages = await ReviewImage.findByPk(reviewImageId)
    if(!reviewImages) {
        const err = new Error('Review Image does not exist')
        err.title = 'Review Image couldn\'t be found'
        err.status = 404
        err.error = [{
            message: "Review Image couldn't be found",
            statusCode: 404
        }]
        return next(err)
    }
   await reviewImages.destroy()
   res.json(({
        message: "Successfully deleted",
        statusCode: 200
   }))
})

module.exports = router;
