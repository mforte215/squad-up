// import the router class from express.js framework
const router = require('express').Router();

// deconstructed object importing the the database models from the models module 
const { User, Post, Comment } = require('../../models');



// Get all User Posts 
router.get('/', async (req, res) => {
    try {
        const userPosts = await Post.findAll({
            where: { user_id: 1 },
        });

        res.status(200).json(userPosts);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get a specific post by ID 
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const postData = await Post.findByPk(postId);

        //Check if the post exists and belongs to the user
        if (!postData || postData.user_id !== 1) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Create a new post for user
router.post('/', async (req, res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_id: 1,
        });

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Update a specific post by ID
router.put('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const updatePost = await Post.update({...req.body},
            {
                where: { id: postId, user_id: 1 },
            }
        );
        //Check if post was found and updated
        if (updatePost [0] === 0) {
            res.status(404).json({ message: 'No post found with this id'})
        }

        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Delete a specific post by ID
router.delete('/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const deletedPostCount = await Post.destroy({
            where: { id: postId, user_id: 1 },
        });

        // Check if post was found and deleted 
        if (deletedPostCount === 0) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
