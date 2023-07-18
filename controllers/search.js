const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const User             = require('../models/user');
const Customer         = require('../models/customer');
const Service          = require('../models/services');
const TypeCustomer     = require('../models/type-customer');

const allowColection  = [
  'users',
  'customers',
  'services',
];

const searchUsers = async ( term = '', res = response ) => {

  const mongoId   = ObjectId.isValid( term ); // true
  if ( mongoId ) {
    const user = await User.findById( term );
    return res.json({
      resutls: ( user ) ? [ user ] : []
    });
  }

  const regEx = new RegExp( term, 'i' );
  const users = await User.find({ 
    $or: [ { name:regEx }, { email:regEx }, { username:regEx }],
    $and: [{ status: true }]
  });
  res.json({
    resutls: users
  });
}

const searchCustomer = async ( term = '', res = response ) => {

  const mongoId   = ObjectId.isValid( term ); // true
  if ( mongoId ) {
    const customer = await Customer.findById( term );
    return res.json({
      resutls: ( customer ) ? [ customer ] : []
    });
  }

  const regEx = new RegExp( term, 'i' );
  const customers = await Customer.find({ 
    $or: [ { name:regEx }, { email:regEx } ],
    $and: [{ status: true }]
  }).populate('customerType')
  res.json({
    resutls: customers
  });
}

const searchServices = async ( term = '', res = response ) => {

  const mongoId   = ObjectId.isValid( term ); // true
  if ( mongoId ) {
    const service = await Service.findById( term );
    return res.json({
      resutls: ( service ) ? [ service ] : []
    });
  }

  const regEx = new RegExp( term, 'i' );
  const services = await Service.find({ 
    $or: [ { name:regEx } ]
  });
  res.json({
    resutls: services
  });
}

const search = ( req, res = response ) => {

  const { colection, term } = req.params;

  if ( !allowColection.includes( colection )) {
    return res.status(400).json({
      message: `Las colecciones permitidas son: ${allowColection}`
    });
  }
  switch (colection) {
    case 'users':
      searchUsers( term, res );
    break;
    case 'customers':
      searchCustomer( term, res )
    break;
    case 'services':  
      searchServices( term, res )
    break;
    default:
      res.status(500).json({
        message: `Busqueda no definida`
      });
    break;
  }
}


module.exports = {
  search
}