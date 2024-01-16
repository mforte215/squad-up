const router = require('express').Router();
const {Message} = require('../../models/Message');

//CRUD Methods for messages

//Messages should be private so we will not expose an endpoint that returns all the messages. Instead we will only allow access to messages owned by conversations owned by the requester 

//GET ALL SENT MESSAGES BY THE LOGGED IN USER 
router.get('/', async (req, res) => {

    try {
        if (!req.session.user_id) {
            res.redirect('/login')
        }

        console.log(req.body)
        const foundMessages = Message.findAll({
            where: {
                user_id: req.session.user_id
            },

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