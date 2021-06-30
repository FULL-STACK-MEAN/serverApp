const pdf = require('html-pdf');
const path = require('path');

const createBudgetPDF = () => {
    const content = `<h1>Presupuesto</h1>`;

    pdf.create(content).toFile(path.join(__dirname, '../budgetsPDF/' + 'test.pdf'), (err, res) => {
        if(err) {
            console.log(err)
        }
    })
}

module.exports = {
    createBudgetPDF
}