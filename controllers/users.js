const { response } = require('express');
const User         = require('../models/user');
const bcryptjs     = require('bcryptjs');
const nodemailer = require('nodemailer');
const path       = require('path');
const { exit } = require('process');


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Get many users
 */
const getAllUsers = async ( req, res = response ) => {
  // const status = { status : true };
  const { limit = 15, from = 0 } = req.query;

  const [totals,users] = await Promise.all([
    User.countDocuments(),
    User.find()
    .limit(Number(limit))
    .skip(Number(from)),
  ]);

  res.json({
    totals,
    users,
  });  
};

const getUserById = async ( req, res = response ) => {
  const id = req.params.id;
  
  const user = await User.findById( id );

  res.json({
    ok:true,
    user
  });
};

/**
 * 
 * @param {*} req
 * @param {*} res 
 * create a new user data
 */
const createUsers = async( req, res = response ) => {

  const { name, email, username, password, role, status } = req.body;
  const userLowerCase = username.toLowerCase();
  const statusVerify = status;
  console.log({statusVerify});
  const user = new User({ name, email, username: userLowerCase , password, role, status });

  // hash the password
  const salt    = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( password, salt );

  await user.save();
  var transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    }
  });
  if( process.env.PORT == 8080 ) {
    env = "http://localhost:4200";
  }
  else {
    env = "https://node-services-rqrny.ondigitalocean.app";
  }
  if( statusVerify == false ){
    const mailOptions  = {
      from: user.email,  // sender address
      to: "aguerrerodev.web@gmail.com",   // list of receivers
      subject: 'Nuevo Usuario',
      html: `<div style="background:#cdcdcd;padding:20px;font-size:20px;">
            <div style="background:white;width: 70%;margin: auto;padding: 15px;">
              <img src="cid:logo"/>
              <br>
              <hr>
              Hola Administrador:
              <br>
              El usuario ${user.username} ha creado una cuenta y necesita activarse
              <br><br>
              Haz clic en el botón que aparece a continuación para activar su usuario.
              <br><br>
                <a href="${env}/auth/active/${user._id}" target="_blank" style="background:#026e00;color:white;text-decoration: none;padding:10px;display: table-cell;">Activar Usuario</a>
                </div>
              </div>`,
      attachments: [
        {
          filename: 'node-js.png',
          path: path.join(__dirname, '../assets/node-js.png'),
          cid: 'logo'
        }
      ]
    };
    transporter.sendMail(mailOptions , (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Ocurrio un error, intente nuevamente',
          err
        })
      }
      else {
        res.json({
          ok:true,
          message: 'Usuario creado, se ha enviado un email a nuestros administradores',
          user
        });
      }
  
    });
    transporter.verify(function(error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log('Server is ready to take our messages');
      }
   });
  }
  else {
    res.json({
      ok:true,
      message: 'Usuario creado, se ha enviado un email a nuestros administradores',
      user
    });
  }
}

const activeUser = async ( req, res = response ) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, { status:true }, { new: true });
    res.json({
      ok: true,
      message: 'Se ha activado el usuario exitosamente',
      user
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

/**
 * 
 * @param {*} id
 * @param {*} res 
 * update a user by id
 */
const updateUsers = async( req, res = response ) => {
  const id = req.params.id;
  const { _id, password, google, email, ...data } = req.body;
  
  const user = await User.findByIdAndUpdate( id,  data, { new: true });

  res.json({
    ok:true,
    message:'Se ha actualizado el usuario exitosamente',
    user
  });
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */

 const updateProfileUsers = async( req, res = response ) => {
  
  const idUser = req.params.id;
  const { __v, ...data } = req.body;
  let userProfile = "";

  try {
    //check id
    const user = await User.findById( idUser );
    //check user info
    const userInfo = await User.find();

    if( user.email == data.email ) {
      userProfile = await User.findByIdAndUpdate( idUser, data, { new: true });
    }
    else if (userInfo.email != data.email) {
      userProfile = await User.findByIdAndUpdate( idUser, data, { new: true });
    }
    return res.json({
      ok:true,
      message:'Se ha actualizado el perfil exitosamente',
      user:userProfile
    });
  } catch (error) {
    if(error.code == 11000){
      return res.status(404).json({
        ok:false,
        message: 'Error, el correo ingresado ya pertenece a un usuario',
      });
    }
  }
}

/**
 * 
 * @param {*} id 
 * @param {*} res 
 * deleted a user from bbdd
 */
const deleteUsers = async ( req, res = response ) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete( id )
  res.json({
    ok:true,
    message:'Se ha eliminado el usuario exitosamente',
    user,
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUsers,
  activeUser,
  updateUsers,
  updateProfileUsers,
  deleteUsers,
};

