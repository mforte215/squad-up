const router = require('express').Router();
const {User, Conversation, Message} = require('../models/');
const {Op, fn} = require("sequelize");



router.get('/list', async (req, res) => {

    const myId = req.session.user_id;
    const otherUsers = await User.findAll({
        [Op.not]: [
            {
                id: [req.session.user_id]
            }
        ]
    })

    if (otherUsers) {

        //get all other users but yourself.
        console.log(otherUsers);
        //deserialize the data

        const deserializedUsers = otherUsers.map((user) => {
            return user.get({plain: true});
        })
        //filter myself out of the list and return it 
        const filteredUsers = deserializedUsers.filter((user) => user.id !== myId);
        res.json(filteredUsers);
    }
    else {
        res.status(400).json('SOMETHING WENT WRONG');
    }


});

router.get('/checkcreate/:convo_id', async (req, res) => {
    try {
        console.log("FINDING")
        const castId = parseInt(req.params.convo_id);
        const foundConversation = await Conversation.findAll({
            where: {
                [Op.or]: [
                    {userOne: req.session.user_id, userTwo: castId},
                    {userOne: castId, userTwo: req.session.user_id}
                ]
            }
        });
        if (foundConversation.length) {
            console.log("FOUND AN OLD CONVERSATION");
            console.log(foundConversation);
            console.log(foundConversation);
            res.json({
                id: foundConversation[0].id
            });
            //get the ID out of the first object in the array.


        }
        else {
            console.log("NO CONVERSATION EXISTED. CREATE A NEW ONE WITH THE IDs");
            const newConversation = await Conversation.create({
                userOne: req.session.user_id,
                userTwo: castId,
            });


            if (newConversation) {
                console.log("MADE A NEW CONVERSATION:");
                const deserializedConversation = newConversation.get({plain: true});
                console.log(deserializedConversation);
                res.json({
                    id: deserializedConversation.id,
                })
            }

        }



    } catch (error) {
        console.log("ERROR")
        console.log(error);
        res.status(500).json(error);

    }






})




module.exports = router;