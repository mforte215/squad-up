// import the router class from express.js framework
const router = require('express').Router();

// deconstructed object importing the the database models from the models module 
const { Directory } = require('../../models');

router.get('/directory', async (req, res) => {
    try {
        console.log('Directory accessed!')
      const directoryData = await Directory.findAll(); 
      const persons = directoryData.map((person) => person.get({ plain: true }));
  
      res.render('directory', { persons });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;