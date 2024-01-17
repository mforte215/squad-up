const router = require('express').Router();
const User = require('../../models/User');

//API routes for the User. Generic routes should be:
//1. return ALL users at the root '/'
//2. return ONE user at the route '/:id'
//3. update and return user at the route '/:id'


//the root should return all users
router.get('/', async (req, res) => {

  try {
    //Utilize the Sequelize findAll() method of the model class to find our directory of users. exclude the passwords from the return
    const allUsers = await User.findAll({
      attributes: {exclude: ['password']}
    });

    if (!allUsers) {
      res.status(400).json('No Users in DB');
    }
    //return all the users if the variable is not null (if no users were found it would return null)
    res.status(200).json(allUsers);


  } catch (error) {
    console.log("SOMETHING WENT WRONG");
    console.log(error);
    res.status(500).json('SOMETHING WENT WRONG:' + error);
  }


});

//route: '/:id' should return the user with associated id
router.get('/:id', async (req, res) => {

  try {
    //retrieve the user from the database

    //get the id out of the params
    const paramId = req.params.id;

    //query the db by the id, exlcude password. Handle password on different endpoints that requires auth, this is a public facing API endpoint
    const foundUser = await User.findAll({
      where: {
        id: paramId
      },
      attributes: {exclude: ['password']}
    });

    if (!foundUser) {
      res.status(400).json('No user found by that ID');
    }

    //found a user, so return it with a successfull 200 code
    res.status(200).json(foundUser);

  } catch (error) {
    console.log("SOMETHING WENT WRONG");
    console.log(error);
    res.status(500).json('SOMETHING WENT WRONG:' + error);
  }
});


router.post('/', async (req, res) => {
  try {

    const userCreate = await User.create(req.body);

    //if the user is successfully created, log them in, and send a 200 response
    console.log("LOGGING NEWLY CREATED USER");
    console.log(userCreate);
    //deserialize the db response
    const newUser = userCreate.get({plain: true});
    req.session.save(() => {
      req.session.user_id = newUser.id;
      req.session.email = newUser.email;
      req.session.logged_in = true;

      res.json({user: newUser, message: 'You are now logged in!'});
    })

  } catch (err) {
    res.status(400).json(err);
  }
});




//* PUT ROUTES
//#On update user account button click
router.put('/:id', async (req, res) => {

  //RESTRICTED ACCESS: you should only be able to update yourself through the API
  try {

    if (req.session.user_id === req.params.id) {
      const userUpdate = await User.update({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        bio: req.body.bio,
        password: req.body.password
      }, {
        where: req.params.id,
      });


      if (!userUpdate) {
        res.status(500).json('SORRY SOMETHING WENT WRONG!');
      }

      res.status(200).json(userUpdate)
    }
    else {
      res.status(401).json('UNAUTHORIZED: ACCESS DENIED');
    }


  } catch {
    res.status(500)
  }
})


//route: root '/' post to create a new user. the request must contain all the relevant properties of the user INCLUDING the UNHASHED password. the "beforeCreate" hook
//in the model will leverage bcrypt right BEFORE the create method actually executes, that's why passwords are only ever stored as hash values in the database.


//#When the user login API is called
router.post('/login', async (req, res) => {
  try {
    //get the user by their email that was submitted in the form with id of 'email'
    const userData = await User.findOne({where: {email: req.body.email}});
    //if there was no user data found at that email, return 400 w/ message
    if (!userData) {
      res
        .status(400)
        .json({message: 'Incorrect email or password, please try again'});
      return;
    }
    //to ensure the info was correct, we need to check the password that was submitted on the form, with the password that was just returned in the userData
    const validPassword = await userData.checkPassword(req.body.password);
    //if it is the wrong password, retrun 400 and JSON saying wrong password
    if (!validPassword) {
      res
        .status(400)
        .json({message: 'Incorrect email or password, please try again'});
      return;
    }
    //at this point, we have verified that the email and password are correct, and we can successfully "login" the user.
    //before that, we're going to create a session object to be saved on the Database to persist info
    //we're going to want to have (at least) 3 pieces of info in the session. User Id, Email, and Logged_in status. 
    //we will use these values to manipulate the webpage
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.email = userData.email;
      req.session.logged_in = true;

      //respond back saying that you are logged in (remember this is the API, now that we have a 200 status returned on the front end, we can change the DOM)
      res.json({user: userData, message: 'You are now logged in!'});
    });

  } catch (err) {
    //the method errored out
    res.status(400).json(err);
  }
});

//# When the user logs out
router.post('/logout', (req, res) => {

  //make sure the user is actually logged in before destroying the logged in session. If the user making the request is NOT logged in, response with a 404
  if (req.session.logged_in) {
    //if the user is logged in, destroy the session, effectively logging the user out, and response with a success 204
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;