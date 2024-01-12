const router = require('express').Router();
const userRoutes = require('./user-routes');
const homeRoutes = require('./home-routes');
const apiRoutes = require('./api');

router.use('/users', userRoutes);
router.use('/', homeRoutes);
router.use('/api', apiRoutes);

module.exports = router;