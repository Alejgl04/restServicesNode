
const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true
  },
  username: {
    type: String,
    required: [true, 'El usuario es obligatorio'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'la contraseña es obligatoria']
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  status: {
    type: Boolean,
    required: true,
  },
  google: {
    type: Boolean,
    default: false
  },
});

UserSchema.methods.toJSON = function(){
  const { __v, password, _id, google, ...user } = this.toObject();
  user.uid = _id;
  return user;
}
module.exports = model( 'User', UserSchema );