const router = require('express').Router();
const {User} = require('../models/User');
const Post = require('../models/post')

//#When the Create/Login button is selected from the homepage
router.get('/CreateUserOrLogin', async (req,res) => {
    res.render('login')
})

//#When settings button is selected from the homepage 
router.get('/account', async (req,res) => {
    res.render('account')
})


module.exports = router;

