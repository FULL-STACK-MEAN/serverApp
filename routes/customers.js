const express = require('express');
const app = express();
const { tokenVerification } = require('../middleware/tokenverification');
const { ErrorHandler } = require('../helpers/errors');
const { createCustomer, getCustomers, getCustomer, updateCustomer, findCustomers } = require('../services/customers');

/**
* @swagger
* tags:
*   name: Customers
*   description: Customer API Rest (needs json webtoken)
*/

/**
* @swagger
* /customers/search/{term}:
*   get:
*       summary: return customers matched by name
*       tags: [Customers]
*       parameters:
*           - in: path
*             name: term
*             schema:
*               type: string
*             required: true
*             description: string to be used in regex to match customers by name field
*       produces:
*           - application/json
*       responses:
*           200:
*               description: 'json response {customers: <array-customers> | []}'
*           404:
*               description: term param mandatory error
*           500:
*               description: general database error
*/

app.get('/search/:term', tokenVerification, async (req, res, next) => {
    try {
        if(req.params.term === undefined) {
            throw new ErrorHandler(404, 'search term param is mandatory')
        }
        const customers = await findCustomers(req.params.term);
        res.status(200).json({
            customers
        })
    } catch(err) {
        return next(err);
    }
})

app.get('/:skip/:limit', tokenVerification, async (req, res, next) => {
    try {
        const customersData = await getCustomers(Number(req.params.skip), Number(req.params.limit));
        res.status(200).json({
            totalCustomers: customersData.totalCustomers,
            customers: customersData.customers
        })
    } catch(err){
        return next(err);
    }
})


app.get('/:_id', tokenVerification, async (req, res, next) => {
    try {
        const customer = await getCustomer(req.params._id)
        res.status(200).json({
            customer
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

app.put('/:_id', tokenVerification, async (req, res, next) => {
    try {
        const customerUpdated = await updateCustomer(req.params._id, req.body);
        res.status(200).json({
            message: 'El cliente fue actualizado correctamente',
            customerUpdated
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;