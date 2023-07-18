const { response } = require("express");
const path       = require('path');
const UserModel  = require('../models/user');
const nodemailer = require('nodemailer');
const bcryptjs   = require('bcryptjs');

var transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS
  }
});

const updatePassword = async (req, res = response, next) => {
  try {
    const { password } = req.body;
    const id = req.params.id;
    // hash the password
    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(password, salt);

    const user = await UserModel.findByIdAndUpdate(id, { password: newPassword }, { new: true });
    next();

    res.json({
      ok: true,
      message: 'Se ha actualizado la contraseña exitosamente',
      user
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
    });
  }
}

const recoveryMail = async (req, res = response) => {
  let env = '';
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (user !== null) {
    if( process.env.PORT === 8080 ) {
      env = "http://localhost:4200";
    }
    else {
      env = "https://node-services-rqrny.ondigitalocean.app";
    }
      
    const dataMail = {
      from: 'admin@hotmail.com',  // sender address
      to: email,   // list of receivers
      subject: 'Restablecer contraseña',
      html: `<div style="background:#cdcdcd;padding:20px;font-size:20px;">
              <div style="background:white;width: 70%;margin: auto;padding: 15px;">
                <img src="cid:logo"/>
                <br>
                <hr>
                Hola ${user.name}:
                <br><br>
                Hemos recibido una solicitud de restablecimiento de contraseña de tu cuenta.
                <br><br>
                Haz clic en el botón que aparece a continuación para cambiar tu contraseña.
                <br><br>
                Ten en cuenta que este enlace es válido solo durante 24 horas. Una vez transcurrido el plazo, deberás volver a solicitar el restablecimiento de la contraseña.
                <br><br><br>
                <a href="${env}/auth/change/${user._id}" target="_blank" style="background:#026e00;color:white;text-decoration: none;padding:10px;display: table-cell;">Cambiar Contraseña</a>
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
    transporter.sendMail(dataMail, (err, data) => {
      if (err) {
        return res.status(400).json({
          message: 'Ocurrio un error' + err,
          err
        })
      }
      else {
        res.json({
          ok:true,
          message: 'Se ha enviado un email a su bandeja de correo electronico',
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
    return res.status(400).json({
      ok: false,
      message: 'El correo ingresado no existe',
      
    }) 
  }
}

module.exports = {
  recoveryMail,
  updatePassword
}
