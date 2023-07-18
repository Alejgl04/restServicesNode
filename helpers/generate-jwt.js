const jwt = require('jsonwebtoken');

const generateJWT = ( uid = '') => {
  return new Promise( (resolve, reject) => {
    const payload = { uid };

    jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn:'1h'
      // expiresIn:'20s'
    }, (err, token) => {
      if ( err ) {
        console.log( err );
        reject( `Ocurrio un error ${ err }, no se pudo generar el token` ) 
      }
      else{
        resolve( token );
      }
    })
  });
}

module.exports = {
  generateJWT
}