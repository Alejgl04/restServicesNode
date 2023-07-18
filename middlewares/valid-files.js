const { response } = require("express")

const FileUpload = ( req, res = response, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      message: 'No hay archivos que subir'
    });
  }
  next();
}

module.exports = {
  FileUpload
}