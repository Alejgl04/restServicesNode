const { Router } = require('express');
const { check }  = require('express-validator');

const { ValidFields, validJWT,isAdminAndUserRol, isAdminRol } = require('../middlewares');
const { verifyEmailCustomer, verifyTypeCustomerId, verifyPhoneCustomer, verifyIdCustomer } = require('../helpers/db-valid');
const { getAllCustomer, createCustomer, updateCustomer, deleteCustomer, getCustomerById } = require('../controllers/customer');

const router = Router();

router.get('/', getAllCustomer );

router.get('/:id', [
  validJWT,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyIdCustomer ),
  ValidFields
], getCustomerById );

router.post('/', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('email', 'El correo electrónico es inválido').isEmail(),
  check('email').custom( verifyEmailCustomer ),
  check('phone', 'El número de teléfono es obligatorio').not().isEmpty(),
  check('phone').custom( verifyPhoneCustomer ),
  check('phone').custom( verifyPhoneCustomer ),
  check('customerType','No es un id valido').isMongoId(),
	check('customerType').custom( verifyTypeCustomerId ),
  ValidFields
], createCustomer );

router.put('/:id', [
  validJWT,
  isAdminAndUserRol('ADMIN_ROLE','USER_ROLE'),
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyIdCustomer ),
  check('customerType','El id de tipo de cliente no es válido').isMongoId(),
	check('customerType').custom( verifyTypeCustomerId ),
  ValidFields
], updateCustomer );

router.delete('/:id', [
  validJWT,
  isAdminRol,
  check('id', 'No es un id válido').isMongoId(),
  check('id').custom( verifyIdCustomer ),
  ValidFields,
], deleteCustomer );

module.exports = router;