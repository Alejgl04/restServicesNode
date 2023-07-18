const Role = require('../models/role');
const typeCustomer = require('../models/type-customer');
const User = require('../models/user');
const Customer = require('../models/customer');
const Service = require('../models/services');


const validRol = async ( role = '' ) => {
  const rolExists = await Role.findOne({role});
  if( !rolExists ) {
    throw new Error( `El rol: ${role} no es válido` )
  }
}

const validEmailExists = async( email = '' ) => {
  const emailExists = await User.findOne({ email });
  if ( emailExists  ) {
    throw new Error( `El correo electrónico ya está registrado` )
  }
}

const validUserById = async( id = '' ) => {
  const isUserById = await User.findById( id );
  if ( !isUserById  ) {
    throw new Error( `El id ingresado no existe` )
  }
}

const validUsername = async ( username = '' ) => {
  const userLowerCase = username.toLowerCase();

  const isUsername = await User.findOne({ username:userLowerCase });
  if ( isUsername  ) {
    throw new Error( `El usuario: ${username} ya está registrado` )
  }
}

/**
 * 
 * @param {*} typename 
 * Validations for customer type 
 */
const verifyTypeCustomer = async ( typename = '' ) => {
  const isTypeCustomerName = await typeCustomer.findOne({ typename });
  if( isTypeCustomerName ) {
    throw new Error( `El tipo de nombre de cliente ingresado ya está registrado` );
  }
}

const verifytypeCustomerById = async ( id = '' ) => {
  const isTypeCustomerId = await typeCustomer.findById( id );
  if ( !isTypeCustomerId  ) {
    throw new Error( `El id ingresado no existe` )
  }
}

const verifyCustomerId = async ( idtype = '' ) => {
  const isTypeCustomerId = await Customer.find();
  if( isTypeCustomerId ) {
    isTypeCustomerId.forEach(element => {
      if( element.customerType == idtype ){ 
        throw new Error( `No se puede eliminar este registro ya que esta asignado a un cliente` );
      }
    });
  }
}


/**
 * Validations for customer
 */

const verifyPhoneCustomer = async ( phone = '' ) => {
  const isPhoneCustomer = await Customer.findOne({ phone });
  if ( isPhoneCustomer  ) {
    throw new Error( `El número de teléfono: ${phone} ya está registrado` )
  }
}

const verifyEmailCustomer = async( email = '' ) => {
  const emailExists = await Customer.findOne({ email });
  if ( emailExists  ) {
    throw new Error( `El correo electrónico ya está registrado` )
  }
}


const verifyTypeCustomerId = async ( id = '' ) => {
	const isTypeId = await typeCustomer.findById(id);
    if (!isTypeId) {
		throw new Error(`El id tipo de cliente ${id} no existe`)
	}
}

const verifyIdCustomer = async ( id = '' ) => {
  const isValidId = await Customer.findById(id);
  if (!isValidId) {
    throw new Error(`El id cliente ${id} no existe`)
  }
}

/**
 * Valids for services
 */

const verifyServicesName = async ( name = '' ) => {
  const servicesName = await Service.findOne({ name });
  if ( servicesName  ) {
    throw new Error( `El ${name} ya está registrado, ingrese otro servicio` )
  }
}

const verifyServiceId = async ( id = '' ) => {
  const isIdValid = await Service.findById( id );
  if (!isIdValid) {
    throw new Error(`El id ${id} no existe`)
  }
}

/**
 * Check allow colections 
 */

const allowColections = ( colection = '', colections = []) => {
  const colectionDB = colections.includes(colection);
  if(!colectionDB) {
    throw new Error(`La colección ${colection} no es permitida, ${colections}`);
  }
  return true;
} 

module.exports = {

  validRol,
  validEmailExists,
  validUserById,
  validUsername,

  verifyTypeCustomer,
  verifytypeCustomerById,
  verifyCustomerId,

  verifyPhoneCustomer,
  verifyEmailCustomer,
  verifyTypeCustomerId,
  verifyIdCustomer,

  verifyServicesName,
  verifyServiceId,

  allowColections


}