const express = require('express');
const app = express();
const { tokenVerification } = require('../middleware/tokenverification');
const { ErrorHandler } = require('../helpers/errors');
const { createBudget, getBudgets, getBudget, updateBudget } = require('../services/budgets');
const { createBudgetPDF } = require('../helpers/budgetPDF');
const { getUser } = require('../services/users');

app.get('/', tokenVerification, async (req, res, next) => {
    try {
        const budgets = await getBudgets();
        res.status(200).json({
            budgets
        })
    } catch(err) {
        return next(err);
    }
})

app.get('/createpdf/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
               throw new ErrorHandler(404, '_id param is mandatory')
        }
        const budget = await getBudget(req.params._id);
        const user = await getUser(budget.idSalesUser);
        await createBudgetPDF(budget, user);
        res.status(200).json({
            message: 'El PDF fue generado correctamente'
        })
    } catch (err) {
        return next(err);
    }
})

app.get('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
               throw new ErrorHandler(404, '_id param is mandatory')
        }
        const budget = await getBudget(req.params._id);
        res.status(200).json({
            budget
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
           req.body.items === undefined ||
           req.body.idSalesUser === undefined) {
               throw new ErrorHandler(404, 'customer, data, validUntil, items and idSalesUser data are mandatory')
        }
        const budgetSaved = await createBudget(req.body);
        // const user = await getUser(req.body.idSalesUser);
        // await createBudgetPDF(budgetSaved, user);
        res.status(200).json({
            message: 'El presupuesto fue creado correctamente',
            budgetSaved
        })
    } catch(err) {
        return next(err);
    }
})


app.put('/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
               throw new ErrorHandler(404, '_id param is mandatory')
        }
        const budgetUpdated = await updateBudget(req.params._id, req.body);
        res.status(200).json({
            message: 'El presupuesto fue actualizado correctamente',
            budgetUpdated
        })
    } catch(err) {
        return next(err);
    }
})

module.exports = app;