const { v4: uuidv4 } = require('uuid');
const path = require('path');


const uploadFile = ( files, folder = '' ) => {
  return new Promise(( resolve, reject ) =>{
  
  const { file }  = files;
  const nameCut   = file.name.split('.');
  const extension = nameCut[ nameCut.length-1 ];
  
    // Check Extension File
    const allowExtension = ['png', 'jpg', 'jpeg'];
    if( !allowExtension.includes( extension ) ) {
      return reject(`La extensión ${extension} no es permitida, extensiones validas: ${allowExtension}`);
    }
    
    const nameTmp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname + '../../uploads/', folder, nameTmp);

    file.mv(uploadPath, function(err) {
      if (err) {
        return reject(err)
      }

      resolve( nameTmp )
    });
  });
}


module.exports = {
  uploadFile
}