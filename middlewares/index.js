const validField = require('./valid-fields');
const validToken = require('./valid-jwt');
const validRol   = require('./valid-rols');
const FileUpload = require('./valid-files');


module.exports = {
  ...validField,
  ...validToken,
  ...validRol,
  ...FileUpload
}
