const express = require('express');
const cors    = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');
// MAIN SERVER
class Server {

  constructor(){
    this.app         = express();
    this.port        = process.env.PORT;
    // path api
    this.pathsRoutes = {
      users: '/api/users',
      auth:  '/api/auth',
      typeCustomer: '/api/typecustomer',
      customer: '/api/customer',
      contact:  '/api/mails',
      search:   '/api/search',
      services: '/api/services',
      uploads:  '/api/uploads'
    }
    // Connect DB
    this.connectDB();
    
    // Middlewares
    this.middlewares();

    // Called routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use( cors() );

    // Parse JSON and Read Body data
    this.app.use( express.json() );

    // direct public
    this.app.use( express.static('public'));

    // Uploas Files
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true
    }));
  }

  // Routes App
  routes() {
    this.app.use(this.pathsRoutes.auth, require('../routes/auth'));
    this.app.use(this.pathsRoutes.customer, require('../routes/customer'));
    this.app.use(this.pathsRoutes.contact, require('../routes/mails'));
    this.app.use(this.pathsRoutes.typeCustomer, require('../routes/type-customer'));
    this.app.use(this.pathsRoutes.services, require('../routes/services'));
    this.app.use(this.pathsRoutes.search, require('../routes/search'));
    this.app.use(this.pathsRoutes.users, require('../routes/users'));
    this.app.use(this.pathsRoutes.uploads, require('../routes/uploads'));
  }
  
  // Listen server
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running listening at ${this.port}`)
    });
  }
}

module.exports = Server;