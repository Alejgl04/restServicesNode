const { Router } = require('express');
const { check }  = require('express-validator');
const { loginAuth,refreshTokenGet, refreshTokenPost } = require('../controllers/auth');
const { validJWT } = require('../middlewares');
const { ValidFields } = require('../middlewares/valid-fields');

const router = Router();

router.post('/login', [
  check('username', 'El username es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  ValidFields
],loginAuth );
/*Login*/
router.get('/refresh', validJWT,  refreshTokenGet );

router.post('/refresh',  refreshTokenPost );

module.exports = router;