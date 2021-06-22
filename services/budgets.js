const Budget = require('../models/budget');
const { ErrorHandler } = require('../helpers/errors');

const createBudget = async (budgetData) => {
    try {
        const budget = new Budget({
            customer: budgetData.customer,
            code: null,
            date: budgetData.date,
            validUntil: budgetData.validUntil,
            items: budgetData.items
        })
        const budgetSaved = await budget.save();
        return budgetSaved;
    } catch(err) {
        if (err.name === "CastError") {
            throw new ErrorHandler(404, 'MongoDB Error validation data type');
        } else {
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

module.exports = {
    createBudget
}
