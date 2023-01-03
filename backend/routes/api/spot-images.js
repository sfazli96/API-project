const express = require('express')
const { User, Spot, SpotImage, Review, ReviewImage, Booking, sequelize } = require('../../db/models')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


// Delete a Spot Image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
    const imageId = req.params.imageId;
    const image = await SpotImage.findByPk(imageId);

    // Couldn't find a Spot Image with the specified id
    if (!image) {
      res.status(404);
      return res.json({
        "message": "Spot Image couldn't be found",
        "statusCode": 404
      })
    }
    const spot = await Spot.findByPk(image.spotId);
    if (req.user.id !== spot.ownerId) {
      res.status(403)
      return res.json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }

    // delete spot image
    await image.destroy();
    return res.json({
      "message": "Successfully deleted",
      "statusCode": 200
    })
  })

module.exports = router;
