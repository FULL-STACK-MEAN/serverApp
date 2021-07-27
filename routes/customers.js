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
*   components:
*       schemas:
*           Customer:
*               type: object
*               required:
*                   - name
*                   - cif
*                   - adress
*                   - cp
*                   - city
*                   - contact
*               properties:
*                   _id:
*                       type: Object(id)
*                       description: MongoDB unique identifier
*                   name:
*                       type: string
*                       description: customer name
*                   cif:
*                       type: string
*                       description: legal cif customer identifier
*                   adress:
*                       type: string
*                       description: customer adress
*                   cp:
*                       type: string
*                       description: customer adress postal code
*                   city:
*                       type: string
*                       description: customer adress city
*                   contact:
*                       type: object    
*                       description: customer contact properties (name, surname, phone and email)
*                   createdAt:
*                       type: date    
*                       description: customer creation date
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

/**
* @swagger
* /customers/{skip}/{limit}:
*   get:
*       summary: return all customers paginated
*       tags: [Customers]
*       parameters:
*           - in: path
*             name: skip
*             schema:
*               type: number
*             required: true
*             description: skip number in query
*           - in: path
*             name: limit
*             schema:
*               type: number
*             required: true
*             description: limit number in query
*       produces:
*           - application/json
*       responses:
*           200:
*               description: 'json response {totalCustomers: <integer>, customers: <customers-array>}'
*           404:
*               description: skip and limits params mandatory error
*           500:
*               description: general database error
*/

app.get('/:skip/:limit', tokenVerification, async (req, res, next) => {
    try {
        if(req.params.skip === undefined || req.params.limit === undefined) {
            throw new ErrorHandler(404, 'skip and limit params are mandatory')
        }
        const customersData = await getCustomers(Number(req.params.skip), Number(req.params.limit));
        res.status(200).json({
            totalCustomers: customersData.totalCustomers,
            customers: customersData.customers
        })
    } catch(err){
        return next(err);
    }
})


/**
* @swagger
* /customers/{_id}:
*   get:
*       summary: return specific customer matched by _id
*       tags: [Customers]
*       parameters:
*           - in: path
*             name: _id
*             schema:
*               type: string
*             required: true
*             description: _id customer MongoDB Identifier
*       produces:
*           - application/json
*       responses:
*           200:
*               description: 'json response {customer: <object>}'
*           404:
*               description: skip and limits params mandatory error
*           500:
*               description: general database error
*/

app.get('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
            throw new ErrorHandler(404, '_id param is mandatory')
        }
        const customer = await getCustomer(req.params._id)
        res.status(200).json({
            customer
        })
    } catch(err){
        return next(err);
    }
})

/**
* @swagger
* /customers:
*   post:
*       summary: create new customer
*       tags: [Customers]
*       parameters:
*           - in: body
*             name: customer
*             description: see customer schema
*             schema:
*               type: object
*               required:
*                   - name
*                   - cif
*                   - adress
*                   - cp
*                   - city
*                   - contact
*               properties:
*                   name:
*                       type: string
*                   cif:
*                       type: string
*                   adress:
*                       type: string
*                   cp:
*                       type: string
*                   city:
*                       type: string
*                   contact:
*                       type: object
*       produces:
*           - application/json
*       responses:
*           200:
*               description: 'json response {message: <ok-message>, customer: <new-customer>}'
*           404:
*               description: name, cif, address, cp, city and contact body properties mandatory error
*           500:
*               description: general database error
*/

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


/**
* @swagger
* /customers/{_id}:
*   put:
*       summary: update single customer matched by _id
*       tags: [Customers]
*       parameters:
*           - in: path
*             name: _id
*             schema:
*                type: string
*             required: true
*             description: _id customer MongoDB identifier
*           - in: body
*             name: customer
*             description: see customer schema
*             schema:
*               type: object
*               properties:
*                   name:
*                       type: string
*                   cif:
*                       type: string
*                   adress:
*                       type: string
*                   cp:
*                       type: string
*                   city:
*                       type: string
*                   contact:
*                       type: object
*       produces:
*           - application/json
*       responses:
*           200:
*               description: 'json response {message: <ok-message>, customer: <update-customer>}'
*           404:
*               description: empty body error
*           500:
*               description: general database error
*/

app.put('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.body === undefined || JSON.stringify(req.body) === '{}') {
             throw new ErrorHandler(404, 'body data are mandatory')
         }
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