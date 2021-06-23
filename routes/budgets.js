const express = require('express');
const app = express();
const { tokenVerification } = require('../middleware/tokenverification');
const { ErrorHandler } = require('../helpers/errors');
const { createBudget, getBudgets } = require('../services/budgets');

app.get('/', tokenVerification, async (req, res, next) => {
    try {
        const budgets = await getBudgets;
        res.status(200).json({
            budgets
        })
    } catch(err) {
        return next(err);
    }
})

app.post('/', tokenVerification, async (req, res, next) => {
    try {
        if(req.body.customer === undefined ||
           req.body.date === undefined ||
           req.body.validUntil === undefined ||
           req.body.items === undefined) {
               throw new ErrorHandler(404, 'customer, data, validUntil and items data are mandatory')
        }
        const budgetSaved = await createBudget(req.body);
        res.status(200).json({
            message: 'El presupuesto fue creado correctamente',
            budgetSaved
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;