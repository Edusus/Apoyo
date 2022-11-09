const router = require('express').Router();

const apiUsersRouter = require('./api/users');
const apiChromesRouter=require('./api/chromes');

router.use('/users',apiUsersRouter);
router.use('/chromes',apiChromesRouter);

module.exports = router;
