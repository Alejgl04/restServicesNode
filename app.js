// require('dotenv').config();
// const Server = require('./models/server');

// const server = new Server();
// server.listen();
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path'); 
const fileUpload = require('express-fileupload');
const { dbConnection } = require('./database/config');

const app = express();

// CONFIGURAR CORS
app.use( cors());

//LECTURA Y PARSEO DEL BODY
app.use(express.json());  

// BASE DE DATOS
dbConnection();
// directorio publico
app.use(express.static('public'));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    createParentPath: true
}));
/**Routes */
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/mails', require('./routes/mails'));
app.use('/api/typecustomer', require('./routes/type-customer'));
app.use('/api/services', require('./routes/services'));
app.use('/api/search', require('./routes/search'));
app.use('/api/users', require('./routes/users'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('*',(req, res) => {
	res.sendFile( path.resolve(__dirname,'public/index.html') );
});

app.listen( process.env.PORT, () => {
	console.log('Servidor corriendo en puerto' , process.env.PORT);
});
