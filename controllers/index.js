const router = require('express').Router();
const userRoutes = require('./user-routes');
const homeRoutes = require('./home-routes');
const apiRoutes = require('./api');
const conversationRoutes = require('./conversation-routes');

router.use('/users', userRoutes);
router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router;