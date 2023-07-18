const { Router } = require('express');
const { check }  = require('express-validator');

const { ValidFields, validJWT, isAdminRol } = require('../middlewares');
const { validRol, validEmailExists, validUserById, validUsername } = require('../helpers/db-valid');
const { getAllUsers, createUsers, updateUsers, deleteUsers, getUserById, activeUser, updateProfileUsers } = require('../controllers/users');

const router = Router();

router.get('/', getAllUsers );

router.get('/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  ValidFields
], getUserById );

router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'La contraseña es obligatoria').not().isEmpty(),
  check('password', 'La contraseña debe tener minimo 6 caracteres').isLength({ min:6 }),
  check('username', 'El usuario es obligatorio').not().isEmpty(),
  check('username').custom( validUsername ),
  check('email', 'El correo es inválido').isEmail(),
  check('email').custom( validEmailExists ),
  ValidFields
], createUsers );

router.put('/:id', [
  validJWT,
  isAdminRol,
  // isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  check('role').custom( validRol ), 
  ValidFields
], updateUsers );


router.put('/profile/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo es obligatorio').not().isEmpty(),
  check('email', 'El correo es inválido').isEmail(),
  ValidFields
], updateProfileUsers );

router.put('/active/:id', [
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  ValidFields
], activeUser );

router.delete('/:id', [
  validJWT,
  isAdminRol,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  ValidFields,
], deleteUsers);


router.delete('/profile/remove/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( validUserById ),
  ValidFields,
], deleteUsers);

module.exports = router;