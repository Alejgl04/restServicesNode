const { response } = require("express");
const TypeCustomer = require("../models/type-customer");


const getTypeCustomers = async ( req, res = response ) => {
  const { limit = 15, from = 0 } = req.query;

  const [totals,typeCustomer] = await Promise.all([
    TypeCustomer.countDocuments(),
    TypeCustomer.find()
    .limit(Number(limit))
    .skip(Number(from)),
  ]);

  res.json({
    totals,
    typeCustomer,
  });  
}

const getTypeById = async ( req, res = response ) => {
  const id = req.params.id;
  
  const typeCustomer = await TypeCustomer.findById( id );

  res.json({
    ok:true,
    typeCustomer
  });
};

const createTypeCustomers = async ( req, res = response ) => {

  const data = req.body;
  const typeCustomer = new TypeCustomer( data );

  await typeCustomer.save();
  res.json({
    ok:true,
    message:'Se ha creado el tipo de cliente exitosamente',
    typeCustomer
  });
}

const updateTypeCustomers = async ( req, res = response ) => {
  const id = req.params.id;
  const { typename, description } = req.body;
  let customerUpdate = "";
  try {
    
    //check id
    const typeCustomers = await TypeCustomer.findById(id);
    //check TypeCustomer All
    const typeCustomerAll = await TypeCustomer.find();

    if( typeCustomers.typename === typename ) {
      customerUpdate = await TypeCustomer.findByIdAndUpdate( id, { description:description }, { new: true });
    }
    else if (typeCustomerAll.typename !== typename) {
      customerUpdate = await TypeCustomer.findByIdAndUpdate( id, {typename:typename, description:description }, { new: true });
    }
    res.json({
      ok:true,
      message:'Se ha actualizado el tipo de cliente exitosamente',
      customerUpdate
    });
  } catch (error) {
    if(error.code == 11000){
      return res.status(400).json({
        ok:false,
        message: 'Error, ya existe un tipo de cliente con ese nombre',
      });
    }
  }
}

const deleteTypeCustomers = async ( req, res = response ) => {
  const id = req.params.id;
  const typeCustomer = await TypeCustomer.findByIdAndDelete( id )
  res.json({
    ok:true,
    message:'Se ha eliminado el tipo de cliente exitosamente',
    typeCustomer
  });
}

module.exports = {
  getTypeCustomers,
  getTypeById,
  createTypeCustomers,
  updateTypeCustomers,
  deleteTypeCustomers
}