const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
    check,
    validationResult
} = require('express-validator')

const User = require('../../models/User');

// @route   GET api/auth
// @desc    Auth route
// @access  Public 
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        // .select('-password') is to avoid the returning of the password

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // Auth')
    }
});

// @route   GET api/auth
// @desc    Authenticate user & get token route
// @access  Public 
router.post('/', [
        check(
            'email',
            'Please include a valid email'
        ).isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {
            email,
            password
        } = req.body;
        try {
            let user = await User.findOne({
                email
            });
            if (!user) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: 'Invalid credentials!'
                        }]
                    });
            }

            // match password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: 'Invalid credentials!'
                        }]
                    });
            }
            //the same exact response is a good idea because doesn't define where is the error, if it is the user or the password

            const payload = {
                user: {
                    id: user.id
                }
            }
            jwt.sign(
                payload,
                config.get('jwtSecret'), {
                    expiresIn: 36000
                },
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );
            // res.send('User registered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error')
        }

    })

module.exports = router;