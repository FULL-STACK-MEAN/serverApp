const express = require('express');
const app = express();

const nodemailer = require('nodemailer');

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
        const resPDF = await createBudgetPDF(budget, user);
        console.log(resPDF);
        res.status(200).json({
            message: 'El PDF fue generado correctamente',
            resPDF
        })
    } catch (err) {
        return next(err);
    }
})

app.get('/sendemail/:_id', tokenVerification, async (req, res, next) => {
    try {
        if(req.params._id === undefined) {
               throw new ErrorHandler(404, '_id param is mandatory')
        }
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'getafemean@gmail.com',
                pass: 'NoHay2sin3*'
            }
        })

        const budget = await getBudget(req.params._id);
        console.log(budget.customer.contact.email)
        // En el caso de Gmail, autorizar desde https://myaccount.google.com/lesssecureapps
        const budgetEmail =  {
            from: 'getafemean@gmail.com',
            to: budget.customer.contact.email,
            subject: 'Su presupuesto solicitado',
            html: `
            <body style="margin: 0; padding: 20px; background: grey">
                <table style="display: block; width: 600px; max-width: calc(100% - 40px); margin: 20px auto; padding: 20px; background: white">
                    <tbody style="display: block; width: 100%;">
                        <tr style="display: block; width: 100%;">
                            <td style="display: block; width: 100%; text-align: center; ">
                                <img src="http://localhost:3000/helpers/logo.svg" style="height: 80px">
                            </td>
                        </tr>
                        <tr style="display: block; width: 100%;">
                            <td style="display: block; width: 100%;">
                                <p style="font-family: Arial, Helvetica, sans-serif;">Estimado cliente,</p>
                                <p style="font-family: Arial, Helvetica, sans-serif;">Adjunto a este correo le enviamos el presupuesto solicitado recientemente. Le rogamos se ponga en contacto con nosotros para cualquier duda o consulta adicional.</p>
                            </td>
                        </tr>
                        <tr style="display: block; width: 100%;">
                            <td style="display: block; width: 100%;">
                                <a href="http://localhost:3000/budgetsPDF/${budget.code}.pdf" target="_blank" style="background-color: brown; color: white; font-family:Arial, Helvetica, sans-serif; border: none; border-radius: 5px; padding: 5px 10px;">Descargar presupuesto</a>
                            </td>
                        </tr>
                        <tr style="display: block; width: 100%;">
                            <td style="display: block; width: 100%;">
                                <p style="font-family: Arial, Helvetica, sans-serif;">Atentamente</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </body>
            `,
            attachments: [
                {
                    path: 'budgetsPDF/' + budget.code + '.pdf',
                    contentType: 'application/pdf'
                }
            ]
        }

        transporter.sendMail(budgetEmail, (err, info) => {
            if(err) {
                throw new ErrorHandler(500, 'Error en el envío del correo, inténtelo mas tarde')
            } else {
                console.log(info)
            }
        })

        res.status(200).json({
            message: 'El presupuesto fue enviado correctamente'
        })

    } catch(err) {
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