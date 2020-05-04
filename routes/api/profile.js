const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator')

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post')


// @route   GET api/profile/me - just one user
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user',
            ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({
                msg: 'There is no profile or this user!'
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // Profile')
    }
});


// @route   Post api/profile/
// @desc    Post create or update profile
// @access  Private
router.post(
    '/',
    [
        auth,
        [
            check('status', 'Status is required!').not().isEmpty(),
            check('skills', 'Skills is required!').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        // pull all the fields out
        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram
        } = req.body;

        // build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (status) profileFields.status = status;
        // skills: turning into an array
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }
        console.log(profileFields.skills)
        if (bio) profileFields.bio = bio;
        if (githubusername) profileFields.githubusername = githubusername;

        // build social object
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({
                user: req.user.id
            });
            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate({
                    user: req.user.id
                }, {
                    $set: profileFields
                }, {
                    new: true
                });
                return res.json(profile);
            }
            // create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error // Users Profile')
        }
    }
);


// @route   Get api/profile/
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // Get Profiles');
    }
})


// @route   Get api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({
            msg: 'Profile not found!'
        });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        //you can have a valid ID(exact number of characters or one out of the format, so we need to check it)
        if (err.kind !== 'ObjectId') {
            return res.status(400).json({
                msg: 'Profile not found!'
            });
        }
        res.status(500).send('Server Error // Profile user_id');
    }
});


// @route   Delete api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
    try {
        //remove users posts
        // it's optional - if you want to keep the posts this is unnecessary!!
        await Post.deleteMany({ user: req.user.id });

        //remove profile
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        //remove user
        await User.findOneAndRemove({
            _id: req.user.id
        });
        res.json({
            msg: 'User removed!!'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // Get Profiles');
    }
})


// @route   Put api/profile/experience
// @desc    Delete profile experience
// @access  Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExperience = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.experience.unshift(newExperience);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // User Experience')
    }
})


// @route   Delete api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        // Get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch {
        console.error(err.message);
        res.status(500).send('Server Error // Delete User Experience')
    }
})

// @route   Put api/profile/education
// @desc    Delete profile education
// @access  Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;
    const newEducation = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });

        profile.education.unshift(newEducation);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error // User Education')
    }
})


// @route   Delete api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        });
        // Get remove index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
        profile.education.splice(removeIndex, 1);
        await profile.save();
        res.json(profile);
    } catch {
        console.error(err.message);
        res.status(500).send('Server Error // Delete User Education')
    }
})


// create access to github.
//. first (in config default.json)
// to create githubRepos
// "githubClientId": "go to - https://github.com/settings/applications/new"
// "githubSecret": "second code"

//. second
// at the top add - const request = require('request')
// and            - const config = require('config')  

//. build function
//@route    Get api/profile/github/:username
//@desc     Get user repos from github
//@access   Public

router.get('/github/:username'), (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };

        request(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

module.exports = router;