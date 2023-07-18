const { Router } = require('express');
const { check }  = require('express-validator');

const { ValidFields, validJWT, isAdminAndUserRol, isAdminRol } = require('../middlewares');
const { verifyTypeCustomer, verifytypeCustomerById, verifyCustomerId } = require('../helpers/db-valid');
const { createTypeCustomers, getTypeCustomers, updateTypeCustomers, deleteTypeCustomers, getTypeById } = require('../controllers/type-customer');

const router = Router();

router.get('/', getTypeCustomers );

router.post('/', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('typename', 'El tipo de nombre es obligatorio').not().isEmpty(),
  check('typename').custom( verifyTypeCustomer ),
  ValidFields
], createTypeCustomers );

router.get('/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifytypeCustomerById ),
  ValidFields
], getTypeById );

router.put('/:id', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifytypeCustomerById ),
  ValidFields
], updateTypeCustomers );

router.delete('/:id', [
  validJWT,
  isAdminRol,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifytypeCustomerById ),
  check('id').custom( verifyCustomerId ),
  ValidFields,
], deleteTypeCustomers );

module.exports = router;