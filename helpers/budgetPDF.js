const pdf = require('html-pdf');
const path = require('path');

const createBudgetPDF = (budget, user) => {
    const logoPath = path.join(__dirname, './logo.svg');
    const budgetDate = new Date(budget.date).getDate() + '/' +
                       (new Date(budget.date).getMonth() + 1) + '/' +
                       new Date(budget.date).getFullYear();
    const budgetValidUntil = new Date(budget.validUntil).getDate() + '/' +
                       (new Date(budget.validUntil).getMonth() + 1) + '/' +
                       new Date(budget.validUntil).getFullYear();
    let itemsContent = [];
    budget.items.forEach(elem => {
        itemsContent.push(`
            <tr>
                <td>${elem.article}</td>
                <td>${elem.quantity}</td>
                <td>${elem.price}</td>
                <td>${elem.amount}</td>
            </tr>
        `)
    })
    let totalBudget = 0;
    budget.items.forEach(elem => {
        totalBudget += elem.amount;
    });
    let contactText = `Para mayor información contacte con ${user.name} ${user.surname} en el teléfono ${user.phone}`; 
    const content = `
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        width: 100%;
        color: #5D6975;
        font-family: Arial;
        padding: 0.5cm;
        font-size: 0.25cm;
    }
    h1 {
        font-size: 0.5cm;
        padding: 0.15cm 0;
        text-align: center;
        border-top: 1px solid #5D6975;
        border-bottom: 1px solid #5D6975;
    }
    .logo {
        text-align: center;
    }
    .logo img {
        width: 2cm;
    }
    header {
        padding: 0.30cm 0;
    }

    header p {
        margin-bottom: 0.1cm;
    }
    .customer {
        float: left;
    }
    .customer p span:nth-child(1) {
        display: inline-block;
        width: 2cm;
        text-align: right;
        font-size: 0.24cm;
        margin-right: 0.2cm;
    }
    .customer p span:nth-child(2) {
        font-size: 0.30cm;
        color: #3e4246;
    }
    .company {
        float: right;
    }
    table {
        width: 100%;
        padding: 0.15cm 0;
        border-collapse: collapse;
        border-spacing: 0;
    }
    table th {
        border-top: 1px solid #5D6975;
        border-bottom: 1px solid #5D6975;
    }
    table th,
    table td {
        padding: 0.3cm 0.5cm;
        font-size: 0.30cm;
        text-align: right;
    }
    table th:nth-child(1),
    table td:nth-child(1) {
        text-align: left;
        width: 50%;
    }

    table tr:nth-child(odd) td {
        background: #F5F5F5;
    }

    table.total {
        margin-top: 0.3cm;
    }

    table.total tr td {
        border-top: 1px solid #5D6975;
        background: #F5F5F5;
        text-align: right;
    }

    table.total tr td:nth-child(1) {
        text-align: right;
        width: auto;
    }

</style>
<body>
    <div class="logo">
        <img src="file:///${logoPath}">
    </div>
    <h1>Presupuesto nº ${budget.code}</h1>
    <header>
        <div class="customer">
            <p><span>CLIENTE</span><span>${budget.customer.name}</span></p>
            <p><span>DIRECCIÓN</span><span>${budget.customer.adress}</span></p>
            <p><span>LOCALIDAD</span><span>${budget.customer.cp} ${budget.customer.city}</span></p>
            <p><span>A/ATT.</span><span>${budget.customer.contact.name} ${budget.customer.contact.surname}</span></p>
            <p><span>EMAIL</span><span>${budget.customer.contact.email}</span></p>
            <p><span>FECHA</span><span>${budgetDate}</span></p>
            <p><span>VÁLIDO HASTA</span><span>${budgetValidUntil}</span></p>
        </div>
        <div class="company">
            <p>ACME, S.A.</p>
            <p>Serrano Galvache, 26 28033 Madrid</p>
            <p>+34919999999</p>
            <p>info@acme.com</p>
        </div>
    </header>
    <table>
        <tr>
            <th>Artículo</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Importe</th>
        </tr>
        ${itemsContent.join('')}
    </table>
    <table class="total">
        <tr>
            <td colspan="3">Total presupuesto sin IVA</td>
            <td>${totalBudget}</td>
        </tr>
    </table>
    <p style="margin-top: 0.2cm">${contactText}</p>
</body>
    `;

    pdf.create(content).toFile(path.join(__dirname, '../budgetsPDF/' + budget.code + '.pdf'), (err, res) => {
        if(err) {
            console.log(err)
        }
    })
}

module.exports = {
    createBudgetPDF
}