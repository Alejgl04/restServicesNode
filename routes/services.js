const { Router } = require('express');
const { check }  = require('express-validator');
const { ValidFields, validJWT,isAdminAndUserRol, isAdminRol } = require('../middlewares');
const { verifyServicesName, verifyServiceId } = require('../helpers/db-valid');

const { getServices, getServicesById, createServices, updateServices, deleteServices } = require('../controllers/services');

const router = Router();

router.get('/', getServices );

router.get('/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyServiceId ),
  ValidFields
], getServicesById );

router.post('/', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('name', 'El nombre de servicio es obligatorio').not().isEmpty(),
  check('programmable', 'La programación del servicio es obligatoria').not().isEmpty(),
  check('programmable', 'El valor debe ser númerico').isNumeric(),
  check('programmable', 'El valor de la programación es invalido').isIn([ 0, 14, 30, 90, 365 ]),
  check('name').custom( verifyServicesName ),
  ValidFields
], createServices );

router.put('/:id', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyServiceId ),
  ValidFields
], updateServices );

router.delete('/:id', [
  validJWT,
  isAdminRol,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyServiceId ),
  ValidFields
], deleteServices );

module.exports = router;