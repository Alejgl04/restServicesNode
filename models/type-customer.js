
const { Schema, model } = require('mongoose');

const TypeCustomerSchema = Schema({
  typename: {
    type: String,
    required: [true, 'El tipo de nombre es obligatorio'],
    unique:true
  },
  description: {
    type: String,
  },
});
TypeCustomerSchema.methods.toJSON = function(){
  const { __v, ...typecustomer } = this.toObject();
  return typecustomer;
}

module.exports = model( 'TypeCustomer', TypeCustomerSchema );