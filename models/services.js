
const { Schema, model } = require('mongoose');

const ServiceSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre de servicio es obligatorio']
  },
  description: {
    type: String,
  },
  programmable: {
    type: Number,
    required: [true, 'La programación del servicio es obligatoria'],
    enum: [ 0, 14, 30, 90, 365 ]
  },
});

ServiceSchema.methods.toJSON = function(){
  const { __v, ...services } = this.toObject();
  return services;
}
module.exports = model( 'Service', ServiceSchema );