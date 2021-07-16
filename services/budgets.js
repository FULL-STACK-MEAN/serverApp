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

const getBudget = async (_id) => {
    try {
        const budget = await Budget.findOne({_id});
        return budget;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const getAggCustomers = async () => {
    try {
        const aggCustomers = await Budget.aggregate([
                                        {$unwind: "$items"},
                                        {$group: {_id: "$customer.name", totals: {$sum: "$items.amount"}}},
                                        {$project: {customer: "$_id", totals: 1, _id: 0}},
                                        {$sort: {totals: -1}}
                                    ])
        return aggCustomers;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const getAggMonths = async () => {
    try {
        const aggMonths = await Budget.aggregate([
                                        {$unwind: "$items"},
                                        {$group: {_id: {month: {$month: "$date"}, year: {$year: "$date"}}, totals: {$sum: "$items.amount"}}},
                                        {$project: {month: "$_id.month", year: "$_id.year", totals: 1, _id: 0}},
                                        {$sort: {year: -1, month: -1}},
                                        {$limit: 3}
                                    ])
        return aggMonths;
    } catch(err) {
        throw new ErrorHandler(500, 'Error en base de datos, inténtelo más tarde por favor.');
    }
}

const createBudget = async (budgetData) => {
    try {
        const lastBudgetCode = await Budget.find({},{code: 1, _id: 0}).sort({code: -1}).limit(1);
        let newCode;
        if(lastBudgetCode.length === 0 || lastBudgetCode === undefined) {
            newCode = '001' + '-' + new Date().getFullYear();
        } else {
            newCode = ('000' + (Number(lastBudgetCode[0].code.substring(0,3)) + 1)).slice(-3) + '-' + new Date().getFullYear();
        }
        const budget = new Budget({
            customer: budgetData.customer,
            code: newCode,
            date: budgetData.date,
            validUntil: budgetData.validUntil,
            items: budgetData.items,
            idSalesUser: budgetData.idSalesUser
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

const updateBudget = async (_id, budget) => {
    try {
        const budgetSaved = await Budget.findOneAndUpdate({_id}, budget, {new: true});
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
    createBudget,
    getBudgets,
    getBudget,
    updateBudget,
    getAggCustomers,
    getAggMonths
}
