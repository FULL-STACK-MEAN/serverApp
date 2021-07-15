const Customer = require('../models/customer');
const { ErrorHandler } = require('../helpers/errors');

const getCustomers = async (skip, limit) => {
    try {
        const totalCustomers = await Customer.find({}).countDocuments();
        const customers = await Customer.find({}).sort({name: 1}).skip(skip).limit(limit);
        return { 
            totalCustomers,
            customers
        }
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const getCustomer = async (_id) => {
    try {
        const customer = await Customer.findOne({_id});
        return customer;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const findCustomers = async (term) => {
    try {
        const metaTerm = term.replace(/á/ig, 'a').replace(/é/ig, 'e').replace(/í/ig, 'i').replace(/ó/ig, 'o').replace(/ú/ig, 'u');
        const customers = await Customer.find({metaName: {$regex: metaTerm, $options: 'i'}});
        // const customers = await Customer.find({$text: {$search: term}});
        return customers;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const createCustomer = async (customerData) => {
    try {
        const customer = new Customer({
            name: customerData.name,
            metaName: customerData.name.replace(/á/ig, 'a').replace(/é/ig, 'e').replace(/í/ig, 'i').replace(/ó/ig, 'o').replace(/ú/ig, 'u'),
            cif: customerData.cif,
            adress: customerData.adress,
            cp: customerData.cp,
            city: customerData.city,
            contact: customerData.contact
        })
        const customerSaved = await customer.save();
        return customerSaved;
    } catch(err) {
        if (err.code === 11000) {
            throw new ErrorHandler(404, 'Ya existe un cliente con ese CIF.');
        } else if (err.name === "CastError") {
            throw new ErrorHandler(404, 'MongoDB Error validation data type');
        } else {            
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

const updateCustomer = async (_id, customer) => {
    try {
        if(customer.name !== undefined) {
           customer.metaName = customer.name.replace(/á/ig, 'a').replace(/é/ig, 'e').replace(/í/ig, 'i').replace(/ó/ig, 'o').replace(/ú/ig, 'u');
        }
        const customerSaved = await Customer.findOneAndUpdate({_id}, customer, {new: true});
        return customerSaved;
    } catch(err) {
        if (err.name === "CastError") {
            throw new ErrorHandler(404, 'MongoDB Error validation data type');
        } else {
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    findCustomers
}