const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');


// Write this for every route
// @route   GET/POST api/users
// @desc    Register user
// @access  Public / Private (need token)


// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user', 
        ['name', 'avatar']
        );

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create or update users profile
// @access  Private

router.post(
    '/',
    auth,
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // destructure the request
      const {
        status,
        skills,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook,
        website,
        // spread the rest of the fields we don't need to check
      } = req.body;
  
      // build a profile
      const profileFields = {
        user: req.user.id,
        website:
            website!== ''
            ? website
            : '',
        skills: Array.isArray(skills)
          ? skills
          : skills.split(',').map(skill => skill.trim()),
        status : status ? status : '',
      };
   
      // Build socialFields object
        
      const socialFields = { youtube, twitter, instagram, linkedin, facebook };
      // Equivalent to 
    //   const socialFields = {
    //     youtube: youtube,
    //     twitter: twitter,
    //     instagram: instagram,
    //     linkedin: linkedin,
    //     facebook: facebook
    //   };

      // normalize social fields to ensure valid url
    //   for (const [key, value] of Object.entries(socialFields)) {
    //     if (value && value.length > 0)
    //       socialFields[key] = normalize(value, { forceHttps: true });
    //   }
      // add to profileFields
      profileFields.social = socialFields;
  
      try {
        let profile = await Profile.findOne({ user: req.user.id });
        
        // Using upsert option (creates new doc if no match is found):
        if (profile) {
            let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
        
      } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
      }
    }
  );

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public 
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user id
// @access  Public 
router.get('/user/:user_id', async (req, res) => {
    try {
        const profiles = await Profile.findOne({user : req.params.user_id}).populate('user', ['name', 'avatar']);
        res.json(profiles);

        if (!profiles) {
            return res.status(400).json({ msg: 'Profile not found' });
        }

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
    try {

        // Remove profile
        Profile.findOneAndRemove({ user: req.user.id }),
        // Remove user
        User.findOneAndRemove({ _id: req.user.id })
      
        res.json({ msg: 'User deleted' });

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
    '/experience',
    auth,
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past').notEmpty(),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } 
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        // Push the experience to the front of the array
        profile.experience.unshift(newExp);
  
        await profile.save();
  
        res.json(profile);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    DELETE api/profile/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
  
      foundProfile.experience = foundProfile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
      );
  
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
    '/education',
    auth,
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required and needs to be from the past').notEmpty(),

    async (req, res) => {
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
            } = req.body;
        

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      try {
        const profile = await Profile.findOne({ user: req.user.id });
  
        profile.education.unshift(req.body);
  
        await profile.save();
  
        res.json(profile);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    }
  );

// @route    DELETE api/profile/education/:edu_id
// @desc     Delete education from profile
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
      const foundProfile = await Profile.findOne({ user: req.user.id });
      foundProfile.education = foundProfile.education.filter(
        (edu) => edu._id.toString() !== req.params.edu_id
      );
      await foundProfile.save();
      return res.status(200).json(foundProfile);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: 'Server error' });
    }
  });
  
// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', async (req, res) => {
try {
    const uri = encodeURI(
    `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
    'user-agent': 'node.js',
    Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
} catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
}
});

module.exports = router;