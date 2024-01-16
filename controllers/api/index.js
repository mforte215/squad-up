const router = require('express').Router();
const commentRoutes = require('./commentRoutes');
const postRoutes = require('./postRoutes');
const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');
const conversationRoutes = require('./conversationRoutes');

router.use('/users', userRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router;
