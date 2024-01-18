const router = require('express').Router();
const {User, Conversation, Message, Post} = require('../models/');
const {Op, fn} = require("sequelize");


const dateConvert = (date) => {

    const d = new Date(date);

    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;

}

//GET the homepage
router.get('/', async (req, res) => {
    try {
        //get the latest posts 
        const latestPosts = await Post.findAll({
            attributes: {exclude: ['content']},
            order: [
                ['date_created', 'DESC']
            ],
            include: [
                {
                    model: User,
                    attributes: ['firstName', 'lastName']
                }
            ]
        });

        console.log("LOGGING LATEST POSTS");
        console.log(latestPosts);

        //deserialize posts
        const deserializedPosts = []
        for (let i = 0; i < latestPosts.length; i++) {
            let post = latestPosts[i].get({plain: true});
            post.dateCreated = dateConvert(post.dateCreated);
            deserializedPosts.push(post);
        }
        console.log(deserializedPosts);

        if (req.session.logged_in) {
            res.render('homepage', {
                logged_in: req.session.logged_in,
                email: req.session.email,
                posts: deserializedPosts,
                user_id: req.session.user_id
            })
        }
        else {
            res.render('homepage', {
                logged_in: false,
                email: null,
                user_id: null,
                posts: deserializedPosts,
                user_id: req.session.user_id
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

//GET Resume Builder
router.get('/resume-builder', async (req, res) => {
    try {
        if (!req.session.logged_in) {
            res.redirect('/')
        }
        res.render('resume', {
            user_id: req.session.user_id,
            logged_in: req.session.logged_in,
        });
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
                [Op.or]: [{userOne: req.session.user_id}, {userTwo: req.session.user_id}]
            }
        });

        //loop through conversations and deserialize the found data;
        const conversations = foundConversations.map((convo) => {
            return convo.get({plain: true});
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
                include: [{model: User, as: 'sender'}, {model: Conversation}],
                where: {
                    conversationId: myConversations[j].id
                },
                attributes: {exclude: ['sender.password']}
            });


            //while your at it, save who the conversation is with
            const serializedMessages = [];
            for (let l = 0; l < foundMessages.length; l++) {
                //serialize each
                const serializedOne = foundMessages[l].get({plain: true});
                serializedMessages.push(serializedOne);
            };
            myConversations[j].latest_message = serializedMessages[0];
        }

        res.render('message-center', {
            conversations: myConversations,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
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
        const persons = directoryData.map((person) => person.get({plain: true}));

        res.render('directory', {
            persons: persons, logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/directory/:id', async (req, res) => {
    try {
        //check if the user is checking their own Id or someone elses;
        const isOwner = false;
        if (req.params.id === req.session.user_id) {
            isOwner = true;
        }
        console.log("Is owner:")
        console.log(isOwner);
        console.log('Directory accessed!')
        const paramId = req.params.id;
        const directoryData = await User.findByPk(paramId);
        console.log('directoryData:', directoryData);
        const person = directoryData.get({plain: true});
        console.log(person)

        //get all the posts by the user
        const foundPosts = await Post.findAll({
            where: {
                user_id: paramId
            }
        });

        const normalizedPosts = [];
        for (let i = 0; i < foundPosts.length; i++) {
            const newPost = foundPosts[i].get({plain: true});
            normalizedPosts.push(newPost);
        }

        console.log("Logging Normalized Posts");
        console.log(normalizedPosts);
        res.render('profile', {
            person: person,
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/account', (req, res) => {
    try {
        res.render('account', {
            logged_in: req.session.logged_in,
            user_id: req.session.user_id,
        });
    } catch (err) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'})
    }
});


router.get('/post/new', async (req, res) => {
    try {


        if (!req.session.user_id) {
            res.redirect('/');
        }


        //else render the new post page
        res.render('new-post', {
            logged_in: req.session.user_id,
            user_id: req.session.user_id,
        });

    } catch (error) {

        res.status(500).json(error);


    }


});

router.post('/post/new', async (req, res) => {
    try {
        //get the request and use it to create a new post
        console.log("********************************");
        console.log("Logging request!")
        console.log(req);

        const newPost = await Post.create({

        })

        //else render the new post page
        res.render('new-post', {
            logged_in: req.session.user_id,
            user_id: req.session.user_id,
        });

    } catch (error) {

        res.status(500).json(error);


    }


});




router.get('/post/:id', async (req, res) => {

    //get the post from the req param
    const foundPost = await Post.findByPk(req.params.id);

    //deserialize and send
    const normalizedPost = foundPost.get({plain: true});

    //get the associated user

    const UserResponse = await User.findByPk(normalizedPost.user_id);
    normalizedPost.dateCreated = dateConvert(normalizedPost.dateCreated);
    const noramlizedUser = UserResponse.get({plain: true});
    console.log("LOGGING AUTHOR")
    console.log(noramlizedUser)
    res.render('post', {
        ...normalizedPost,
        logged_in: req.session.logged_in,
        author: `${noramlizedUser.firstName} ${noramlizedUser.lastName}`,
        user_id: req.session.user_id,
    })
});

router.get('/account', (req, res) => {
    try {
        if (req.session.logged_in) {
            res.render('account', {logged_in: req.session.logged_in});
        }
        else {
            res.redirect('/');
        }

    } catch (err) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'})
    }
});



module.exports = router;