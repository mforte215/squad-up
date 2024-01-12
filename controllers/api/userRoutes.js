const router = require('express').Router();
const { User } = require('../../models');

//* PUT ROUTES
//#On update user account button click
router.put('/account', async (req, res) => {
    try {
    const userUpdate = await User.update({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        bio: req.body.bio,
        password: req.body.password
    });
    res.status(200).json(userUpdate)
  } catch {
      res.status(500)
  }
})

//* POST ROUTES
//#When the user selects the "create user" button

router.post('/', async (req, res) => {
    try {
      const userCreate = await User.create(req.body);
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
  
        res.status(200).json(userCreate);
      });
    } catch (err) {
      res.status(400).json(err);
    }
  });

//#When the user selects the "login" button
router.post('/login', async (req, res) => {
    try {
      const userData = await User.findOne({ where: { email: req.body.email } });
  
      if (!userData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await userData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        
        res.json({ user: userData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      res.status(400).json(err);
    }
  });

//# When the user logs out
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });



//#What does the user need?
//TODO Show the login screen & create user screen on same page (GET ROUTE)
    //#Added to the user-routes.js in controllers

//TODO Show the User settings (GET ROUTE)
    //#Added to the user-routes.js in controllers

//TODO Create User (POST ROUTE)
    //# Added to the userCreateLogin.js
//TODO Login User (POST ROUTE)
    //# Added to the userCreateLogin.js
//TODO Add a user info update post to the homepage feed (POST ROUTE)
    //#
//TODO Add a users' share post to the feed (POST ROUTE)

//TODO Update their login details (PUT ROUTE)
  //#DONE
//TODO Delete a shared post (DELETE ROUTE)
//TODO Delete a user account(DELETE ROUTE)

