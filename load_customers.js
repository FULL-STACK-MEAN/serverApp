const cifWords = ['A','B','C','D'];
const cities = ['Madrid','Barcelona','Sevilla','Bilbao'];
const names = ['Laura','Fernando','Sara','Carlos','Lucía'];
const surnames = ['Gómez','Pérez','López','Sánchez'];

let customers = [];

for (i=0; i < 1000; i++) {
    customers.push({
        name: 'Test ' + (i + 1),
        cif: cifWords[Math.floor(Math.random() * cifWords.length)] + Math.floor(Math.random() * 10e7),
        adress: 'lorem ipsum...',
        cp: 'Desconocido',
        city: cities[Math.floor(Math.random() * cities.length)],
        contact: {
            name: names[Math.floor(Math.random() * names.length)],
            surname: surnames[Math.floor(Math.random() * surnames.length)],
            phone: 'Desconocido',
            email: 'Desconocido'
        }
    })
}