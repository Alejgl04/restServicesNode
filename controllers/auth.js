const { response } = require('express');
const bcryptjs     = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const loginAuth = async ( req, res = response ) => {

  const { username , password } = req.body;
  const userLowerCase = username.toLowerCase();

  try {
    
    //check email
    const user = await Usuario.findOne({ username: userLowerCase });
    if( !user ) {
      return res.status(400).json({
        ok:false,
        message: 'El usuario ingresado no existe'
      });
    }
    //check user status true
    if ( !user.status ) {
      return res.status(400).json({
        ok:false,
        message: 'El correo ingresado se encuentra inactivo, hable con el administrador'
      });
    }
    //check the password
    const checkPassword = bcryptjs.compareSync( password, user.password );
    if ( !checkPassword ) {
      return res.status(400).json({
        ok:false,
        message: 'La contraseña ingresada para este usuario es inválida'
      });
    }
    //load JWT
    const token = await generateJWT( user.id );
    res.json({
      ok:true,
      user,
      token
    });    

  } catch (error) {

    console.log( error );
    return res.status(400).json({
      message: 'Ocurrio un error, intente nuevamente',
      error
    });

  }
}

// const refreshTokenPost = async ()


const refreshTokenGet = async ( req, res = response ) => { 

  const userRequest = req.user;
  const token = await generateJWT( userRequest.id );

  return res.json({
    ok:true,
    user:userRequest,
    token
  })

}

const refreshTokenPost = async ( req, res = response ) => { 
  const token = req.header('x-token');
  if( !token ) {
    return res.status(401).json({
      ok:false,
      message: 'No hay token en la petición'
    });
  }
  var { payload } = jwt.decode(token, {complete: true});
  const user = await Usuario.findById( payload.uid );
  const newToken = await generateJWT( payload.uid );

  return res.json({
    ok:true,
    user,
    token:newToken
  })

}

module.exports = {
  loginAuth,
  refreshTokenGet,
  refreshTokenPost
}