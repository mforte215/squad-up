const router = require('express').Router();
const {User} = require('../models/User');


//GET the homepage
router.get('/', async (req, res) => {
    try {
        res.render('homepage', {})
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});



module.exports = router;