const router = require('express').Router();
const {Conversation, Message} = require('../../models');

//CRUD Methods for Conversations

//Conversations should be private so we will not expose an endpoint that returns all the messages. Instead we will only allow access to conversations owned by the requester 

//GET ALL SENT MESSAGES BY THE LOGGED IN USER 
router.get('/', async (req, res) => {

    try {
        if (!req.session.user_id) {
            res.redirect('/login')
        }

        console.log(req.body)
        const foundMessages = Conversation.findAll({
            where: {
                [Op.or]: [{userOne: req.session.user_id}, {userTwo: req.session.user_id}]
            },
        });

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

router.get('/:id', async (req, res) => {
    //return both the conversation details and the messages associated w/ them
    try {
        console.log("finding id for:" + req.params.id);

        //get the conversation details
        conversationMessages = [];
        const conversationData = await Conversation.findAll({
            where: {
                id: req.params.id
            }
        });



        const messages = await Message.findAll({
            where: {
                conversation_id: req.params.id,
            },
            order: [
                ['date_created', 'DESC']
            ]
        });

        if (!messages) {
            res.json(404);
        };


        let otherId;

        if (req.session.user_id === conversationData[0].userOne) {
            otherId = conversationData[0].userTwo;
        }
        else {
            otherId = conversationData[0].userOne;
        }
        //
        /*         console.log("other user id:" + otherId);
                const otherUser = await User.findByPk(otherId);
                console.log("Logging found other user");
                console.log(otherUser);
                const OtherUsername = otherUser.getFullName(); */

        for (let i = 0; i < messages.length; i++) {
            console.log('*****************************');
            console.log("MESSAGE " + i);
            const deSerializedMessage = messages[i].get({plain: true});
            console.log(deSerializedMessage);

            //create an enhanced message object with the extra user data
            let messageSender;
            if (messages[i].user_id === otherId) {
                messageSender = "other";
            }
            else {
                messageSender = 'Me';
            }


            conversationMessages.push({
                message: {
                    id: deSerializedMessage.id,
                    text: deSerializedMessage.text,
                    date_sent: deSerializedMessage.dateCreated,
                    sender: messageSender,
                },

            })

            console.log('*****************************');
            console.log(conversationMessages);
            console.log('*****************************');
        };

        res.status(200).json(conversationMessages);

    } catch (error) {
        res.status(500).json(error);

    }



})

module.exports = router;