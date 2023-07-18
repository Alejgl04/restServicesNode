const { response } = require('express');
const Customer     = require('../models/customer');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * Get many users
 */
const getAllCustomer = async ( req, res = response ) => {
  const status = { status : true };
  const { limit = 15, from = 0 } = req.query;

  const [ totals,customer ] = await Promise.all([
    Customer.countDocuments(),
    Customer.find()
    .populate('customerType','typename')
    .limit(Number(limit))
    .skip(Number(from)),
  ]);

  res.json({
    totals,
    customer
  });   
};

/**
 * 
 * @param {*} req
 * @param {*} res 
 * create a new user data
 */
const createCustomer = async( req, res = response ) => {

  const { status, ...bodyData } = req.body;
  const customer = new Customer(bodyData);

  await customer.save();
  res.json({
    ok:true,
    message:'Se ha creado al cliente exitosamente',
    customer
  });
}

const getCustomerById = async ( req, res = response ) => {
  const id = req.params.id;
  const customer = await Customer.findById( id )
  .populate('customerType','typename');

  res.json({
    ok:true,
    customer
  });
};

/**
 * 
 * @param {*} id
 * @param {*} res 
 * update a user by id
 */
const updateCustomer = async( req, res = response ) => {
  
  const idCustomer = req.params.id;
  // const { name, email, phone, address, customerType, status } = req.body;
  const { __v, ...data } = req.body;
  let customerUpdate = "";
  
  try {
    //check id
    const customer = await Customer.findById( idCustomer );
    //check customer info
    const customerInfo = await Customer.find();

    if( customer.phone == data.phone ) {
      customerUpdate = await Customer.findByIdAndUpdate( idCustomer, data, { new: true });
    }
    else if (customerInfo.phone != data.phone) {
      customerUpdate = await Customer.findByIdAndUpdate( idCustomer, data, { new: true });
    }
    res.json({
      ok:true,
      message:'Se ha actualizado al cliente exitosamente',
      customerUpdate
    });
  } catch (error) {
    if(error.code == 11000){
      return res.status(400).json({
        ok:false,
        message: 'Error, el número ingresado ya pertenece a un cliente',
      });
    }
  }
}

/**
 * 
 * @param {*} id 
 * @param {*} res 
 * deleted a user from bbdd
 */
const deleteCustomer = async ( req, res = response ) => {
  const id = req.params.id;
  const customer = await Customer.findByIdAndRemove( id, { new: true } )
  res.json({
    ok:true,
    message:'Se ha eliminado al cliente exitosamente',
    customer
  });
}



module.exports = {
  getAllCustomer,
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};

