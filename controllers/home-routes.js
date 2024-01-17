const router = require('express').Router();
const { User, Conversation, Message } = require('../models/');
const { Op, fn } = require("sequelize");

//GET the homepage
router.get('/', async (req, res) => {
    try {

        if (req.session.logged_in) {
            res.render('homepage', {
                logged_in: req.session.logged_in,
                email: req.session.email,
                user_id: req.session.user_id,
            })
        }
        else {
            res.render('homepage', {
                logged_in: false,
                email: null,
                user_id: null,
            })
        }



    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

//GET the login page
router.get('/login', async (req, res) => {

    try {
        //if the user is already logged in (there logged in the session), redirect them to the account page
        if (req.session.logged_in) {
            res.redirect('/')
        }

        //else display the login page
        res.render('login', {});
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.get('/sign-up', async (req, res) => {

    try {
        //if the user is already logged in (there logged in the session), redirect them to the account page
        if (req.session.logged_in) {
            res.redirect('/')
        }

        //else display the login page
        res.render('signup', {});
    }
    catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


router.get('/message-center', async (req, res) => {

    try {
        let my_id = req.session.user_id;
        //need to get all conversations and associated messages
        if (!req.session.logged_in) {
            res.redirect('/login');
        }
        //get the conversations associated with the user
        const foundConversations = await Conversation.findAll({
            where: {
                [Op.or]: [{ userOne: req.session.user_id }, { userTwo: req.session.user_id }]
            }
        });

        //loop through conversations and deserialize the found data;
        const conversations = foundConversations.map((convo) => {
            return convo.get({ plain: true });
        });

        myConversations = [];
        for (let i = 0; i < conversations.length; i++) {
            //figure out who the conversation is with
            let otherPerson = null;

            if (my_id === conversations[i].userOne) {
                otherPerson = conversations[i].userTwo;
            }
            else {
                otherPerson = conversations[i].userOne;
            }

            //get the person email
            const messangerFriend = await User.findByPk(otherPerson);
            const friend = messangerFriend.getFullName();

            myConversations.push({
                id: conversations[i].id,
                latest_message: '',
                otherPerson: friend,
            });
        }
        //Get all the messages for the conversations
        for (let j = 0; j < myConversations.length; j++) {
            const foundMessages = await Message.findAll({
                include: [{ model: User, as: 'sender' }, { model: Conversation }],
                where: {
                    conversationId: myConversations[j].id
                },
                attributes: { exclude: ['sender.password'] }
            });


            //while your at it, save who the conversation is with
            const serializedMessages = [];
            for (let l = 0; l < foundMessages.length; l++) {
                //serialize each
                const serializedOne = foundMessages[l].get({ plain: true });
                serializedMessages.push(serializedOne);
            };
            myConversations[j].latest_message = serializedMessages[0];
        }

        res.render('message-center', {
            conversations: myConversations,
            logged_in: req.session.logged_in,
        })



    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }



})


router.get('/directory', async (req, res) => {
    try {
        console.log('Directory accessed!')
        const currentUser = req.session.user_id
        const directoryData = await User.findAll({
            where: {
                id: {
                    [Op.ne]: currentUser,
                },
            },
        });
        const persons = directoryData.map((person) => person.get({ plain: true }));

        res.render('directory', { persons });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/directory/:id', async (req, res) => {
    try {
        console.log('Directory accessed!')
        const paramId = req.params.id;
        const directoryData = await User.findByPk(paramId);
        console.log('directoryData:', directoryData);
        const person = directoryData.get({ plain: true });
        console.log(person)
        res.render('profile', person);
    } catch (err) {
        res.status(500).json(err);
    }
});
module.exports = router;