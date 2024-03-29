const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Must provide a first name'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Must provide a last name'),
  handleValidationErrors
];

// Sign up
router.post('/', validateSignup, async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    const isEmail = await User.findOne({
      where: {
        email
      }
    })
    if (isEmail) {
      const err = new Error('User already exists')
      err.status = 403
      err.errors = ["User with that email already exists"]
      next(err)
    }

    const isUsername = await User.findOne({
      where: {username}
    })
    if (isUsername) {
      const err = new Error('User already exists')
      err.status = 403
      err.errors = ["User with that username already exists"]
      next(err)
    }
    const user = await User.signup({ firstName, lastName, email, username, password });

    const token = await setTokenCookie(res, user);
    const userRes = user.toJSON()
    userRes.token = token
    return res.json(userRes)

    // return res.json({
    //     user: user
    //   });
    // }
  }
);







module.exports = router;
