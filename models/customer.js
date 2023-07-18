const { Schema, model } = require('mongoose');

const CustomerSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true
  },
  phone: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    unique: true
  },
  address: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true
  },
  customerType:{
    type:Schema.Types.ObjectId,
    ref:'TypeCustomer',
    required:true
  },
});

CustomerSchema.methods.toJSON = function(){
  const { __v, ...customer } = this.toObject();
  return customer;
}

module.exports = model( 'Customer', CustomerSchema );