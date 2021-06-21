const express = require('express');
const app = express();
const { tokenVerification } = require('../middleware/tokenverification');
const { ErrorHandler } = require('../helpers/errors');
const { createCustomer, getCustomers } = require('../services/customers');

app.get('/', tokenVerification, async (req, res, next) => {
    try {
        const customers = await getCustomers();
        res.status(200).json({
            customers
        })
    } catch(err){
        return next(err);
    }
})

app.post('/', tokenVerification, async (req, res, next) => {
    try {
        if(req.body.name === undefined || 
            req.body.cif === undefined ||
            req.body.adress === undefined ||
            req.body.cp === undefined ||
            req.body.city === undefined ||
            req.body.contact === undefined) {
             throw new ErrorHandler(404, 'name, cif, address, cp, city and contact data are mandatory')
         }
        let customer = await createCustomer(req.body);
        res.status(200).json({
            message: 'El cliente fue creado correctamente',
            customer
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;