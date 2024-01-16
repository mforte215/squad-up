const router = require('express').Router();
const commentRoutes = require('./commentRoutes');
const postRoutes = require('./postRoutes');
const directoryRoutes = require('./directoryRoutes');
// const userRoutes = require('./userRoutes');

// router.use('/users', userRoutes);
router.use('/directory', directoryRoutes);
router.use('/post', postRoutes);
router.use('/comment', commentRoutes);

module.exports = router;
