const { Router } = require('express');
const { check }  = require('express-validator');
const { ValidFields, FileUpload } = require('../middlewares/');
const { allowColections } = require('../helpers');

const { uploadsFiles, updateImgCloudinary, getImageColection } = require('../controllers/uploads');

const router = Router();

router.post('/' , FileUpload, uploadsFiles );

// router.put('/:colection/:id' , [
//   FileUpload,
//   check('id', 'El id no es válido').isMongoId(),
//   check('colection').custom( c => allowColections( c, ['users'] ) ),
//   ValidFields
// ], updateImg );

router.put('/:colection/:id' , [
  FileUpload,
  check('id', 'El id no es válido').isMongoId(),
  check('colection').custom( c => allowColections( c, ['users'] ) ),
  ValidFields
], updateImgCloudinary );



router.get('/:colection/:id' , [
  check('id', 'El id no es válido').isMongoId(),
  check('colection').custom( c => allowColections( c, ['users'] ) ),
  ValidFields
], getImageColection ); 

module.exports = router;