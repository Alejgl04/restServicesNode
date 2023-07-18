const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL )

const { response } = require("express");
const { uploadFile } = require('../helpers/');

const  User  = require('../models/user');

const uploadsFiles = async ( req, res = response ) => {
  
  try {
    const nameData = await uploadFile( req.files );
    res.json({
      nameData
    });
    
  } catch (msg) {
    return res.status(400).json({ msg })
  }
}


const updateImg = async ( req, res = response ) => {
  
  const { id, colection } = req.params;
  let model;
  
  switch ( colection ) {
    case 'users':
      model = await User.findById( id );
      if( !model ) {
        return res.status(400).json({
          message: 'No existe un usuario por el id'
        })
      }
      break;
      
      default:
        return res.status(500).json({
          message: 'Ocurrio un error, función no implementada'
        })
        break;
  }

  // clear the previus image
  if ( model.image ) {
    // remove image from server
    const pathImage = path.join( __dirname, '../uploads', colection, model.image );
    if ( fs.existsSync( pathImage ) ) {
      fs.unlinkSync( pathImage );
    }
  }
  
  const name = await uploadFile( req.files, colection );
  model.image   = name;
  
  await model.save();

  res.json({
    model
  });
}

const getImageColection = async ( req, res = response ) => {
  const { id, colection } = req.params;
  let model;
  
  switch ( colection ) {
    case 'users':
      model = await User.findById( id );
      if( !model ) {
        return res.status(400).json({
          message: 'No existe un usuario por el id'
        })
      }
      break;
      
      default:
        return res.status(500).json({
          message: 'Ocurrio un error, función no implementada'
        })
        break;
  }

  // clear the previus image
  if ( model.image ) {
    // remove image from server
    const pathImage = path.join( __dirname, '../uploads', colection, model.image );
    if ( fs.existsSync( pathImage ) ) {
      return res.sendFile( pathImage );
    }
  }
  
  const imgPlaceholder = path.join( __dirname, '../assets/no-image.jpg' );
  res.sendFile(
    imgPlaceholder
  );
}


const updateImgCloudinary = async ( req, res = response ) => {
  
  const { id, colection } = req.params;
  let user;
  switch ( colection ) {
    case 'users':
      user = await User.findById( id );
      if( !user ) {
        return res.status(400).json({
          message: 'No existe un usuario por el id'
        })
      }
      break;
      
      default:
        res.status(500).json({
          message: 'Ocurrio un error, función no implementada'
        })
      break;
  }

  // clear the previus image
  if ( user.image ) {
    const nameCutArr = user.image.split('/');
    const name       = nameCutArr[nameCutArr.length -1];
    const [ public_id ] = name.split('.');
    cloudinary.uploader.destroy( public_id );

  }
  const { tempFilePath } = req.files.file;

  const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
  user.image = secure_url;
  await user.save();

  res.json({
    ok:true,
    message: 'Se ha cargado la imagen de perfil exitosamente',
    user
  });
}

module.exports = {
  uploadsFiles,
  updateImg,
  updateImgCloudinary,
  getImageColection
}