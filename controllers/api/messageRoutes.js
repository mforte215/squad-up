const router = require('express').Router();
const {Message} = require('../../models/Message');


//GET ALL SENT MESSAGES BY THE LOGGED IN USER 
router.get('/', async (req, res) => {

    try {
        /* 
                if (!req.session.user_id) {
                    res.redirect('/login')
                } */
        //TESTING PURPOSES: injecting user_id = 1 into the query
        //get the messages for the user
        console.log("LOGGING REQUEST");

        console.log(req.body)
        const foundMessages = Message.findAll({
            where: {
                sender: req.body.sender
            }
        });
        console.log("FOUND MESSAGES");
        console.log(foundMessages);

        if (foundMessages) {
            res.status(200).json(foundMessages);
        }
        else {
            res.status(500).json("SOMETHING WENT WRONG");
        }
    } catch (error) {

        res.status(500).json(error);

    }

});


module.exports = router;