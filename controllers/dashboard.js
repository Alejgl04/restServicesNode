const { response, json } = require('express');
const User         = require('../models/user');
const Customer     = require('../models/customer');
const TypeClient   = require('../models/type-customer');
const Services     = require('../models/services');

const getDashboardData = async ( req, res = response ) => {

  try {
    const [ user, customer, type, services  ] = await Promise.all([
      User.countDocuments(),
      Customer.countDocuments(),
      TypeClient.countDocuments(),
      Services.countDocuments(),
    ]);
  
    return res.json({
      user,
      customer,
      type,
      services
    }); 
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok:false,
      error
    })
  }  
};

module.exports = {
  getDashboardData
}