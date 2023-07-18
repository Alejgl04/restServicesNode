const { response } = require("express");
const Service = require('../models/services');

const getServices = async ( req, res =response ) => {
  const { limit = 15, from = 0 } = req.query;

  const [ totals,services ] = await Promise.all([
    Service.countDocuments(),
    Service.find()
    .limit(Number(limit))
    .skip(Number(from)),
  ]);

  res.json({
    totals,
    services
  });
}

const getServicesById = async ( req, res = response ) => {
  const id = req.params.id;
  
  const services = await Service.findById( id );

  res.json({
    ok:true,
    services
  });
};

const createServices = async ( req, res =response ) => {
  const dataServices = req.body;
  const service = new Service( dataServices );
  
  await service.save();
  res.json({
    ok:true,
    message:'Se ha creado el servicio exitosamente',
    service
  });
}

const updateServices = async ( req, res = response ) => {
  const idService = req.params.id;
  const data      = req.body;
  let serviceUpdate = "";

  try {
    //check id
    const service = await Service.findById( idService );
    //check customer info
    const serviceInfo = await Service.find();
    if( service.name == data.name ) {
      serviceUpdate = await Service.findByIdAndUpdate( idService, data, { new: true });
    }
    else if (serviceInfo.name != data.name) {
      serviceUpdate = await Service.findByIdAndUpdate( idService, data, { new: true });
    }

    return res.json({
      ok:true,
      message:'Se ha actualizado el servicio exitosamente',
      serviceUpdate
    });

  } catch (error) {
    if(error.code == 11000){
      return res.status(400).json({
        ok:false,
        message: 'Error, el nombre del servicio ingresado ya pertenece a un servicio',
      });
    }
  }
}

const deleteServices = async ( req, res = response ) => {
  const id = req.params.id;
  const service = await Service.findByIdAndRemove( id, { new: true } )
  res.json({
    ok:true,
    message:'Se ha eliminado el servicio exitosamente',
    service
  });
}

module.exports = {
  getServices,
  getServicesById,
  createServices,
  updateServices,
  deleteServices
}