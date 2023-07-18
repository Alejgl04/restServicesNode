const { Router } = require('express');
const { check }  = require('express-validator');
const { recoveryMail, updatePassword } = require('../controllers/mails');
const { ValidFields } = require('../middlewares/valid-fields');
const { validUserById } = require('../helpers/db-valid');
const router = Router();

router.post('/recovery', [
  check('email', 'El correo electrónico es obligatorio').not().isEmpty(),
  check('email', 'El correo es inválido').isEmail(),
  ValidFields
], recoveryMail );

router.put('/newpassword/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min:6 }),
  ValidFields
], updatePassword );


module.exports = router;