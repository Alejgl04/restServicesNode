
const dbvalidators = require('./db-valid');
const generarJWT   = require('./generate-jwt');
const uploadFile   = require('./uploadFiles');

module.exports = {
    
  ...dbvalidators,
  ...generarJWT,
  ...uploadFile

}