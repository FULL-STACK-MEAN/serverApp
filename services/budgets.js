const Budget = require('../models/budget');
const { ErrorHandler } = require('../helpers/errors');

const getBudgets = async () => {
    try {
        const budgets = await Budget.find({})
        return budgets;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const createBudget = async (budgetData) => {
    try {
        const currentBudgetsNumber = await Budget.countDocuments();
        const newCode = ('000' + (currentBudgetsNumber + 1)).slice(-3) + '-' + new Date().getFullYear();
        const budget = new Budget({
            customer: budgetData.customer,
            code: newCode,
            date: budgetData.date,
            validUntil: budgetData.validUntil,
            items: budgetData.items
        })
        const budgetSaved = await budget.save();
        return budgetSaved;
    } catch(err) {
        console.log(err);
        if (err.name === "CastError") {
            throw new ErrorHandler(404, 'MongoDB Error validation data type');
        } else {
            throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
        }
    }
}

module.exports = {
    createBudget,
    getBudgets
}
