const { Router } = require('express');
const { getDashboardData } = require('../controllers/dashboard');
const { validJWT } = require('../middlewares');

const router = Router();


router.get('/', [
  validJWT,
], getDashboardData );



module.exports = router;