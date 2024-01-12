// import the router class from express.js framework
const router = require('express').Router();

// deconstructed object importing the the database models from the models module 
const { User, Post, Comment } = require('../../models');


// Get all User Comments 
router.get('/', async (req, res) => {
    try {
        const userComments = await Comment.findAll({
            where: { user_id: req.session.user_id },
        });

        res.status(200).json(userComments);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Get a specific Comment by ID 
router.get('/:id', async (req, res) => {
    try {
        const commentID = req.params.id;
        const commentData = await Comment.findByPk(postId);

        //Check if the comment exists and belongs to the user
        if (!commentData || commentData.user_id !== req.session.user_id) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json(commentData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Create a new comment for user
router.post('/', async (req, res) => {
    try {
        const newComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Update a specific comment by ID
router.put('/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const updateComment = await Comment.update({...req.body},
            {
                where: { id: commentId, user_id: req.session.user_id },
            }
        );
        //Check if comment was found and updated
        if (updateComment[0] === 0) {
            res.status(404).json({ message: 'No comment found with this id'})
        }

        res.status(200).json(updateComment);
    } catch (err) {
        res.status(400).json(err);
    }
});

//Delete a specific comment by ID
router.delete('/:id', async (req, res) => {
    try {
        const commentId = req.params.id;
        const deletedCommentCount = await Comment.destroy({
            where: { id: commentId, user_id: req.session.user_id },
        });

        // Check if comment was found and deleted 
        if (deletedCommentCount === 0) {
            res.status(404).json({ message: 'No comment found with this id!' });
            return;
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
