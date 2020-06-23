const neatCsv = require('neat-csv');
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function getCsvItems(filePath) {
    let file = fs.readFileSync(filePath, 'utf8')    //Library read the file csv
    let json = await neatCsv(file);

    let items = []
    for (let value in json) {
        items.push(json[value])     //Loop through the file and enter the json in the array
    }

    return items
}

//Parse customers.csv to array
async function parseCustomers() {
    return getCsvItems('data/customers.csv')
}

//Parse products.csv to array
async function parseProducts() {
    return getCsvItems('data/products.csv')
}

//Parse orders.csv to array
async function parseOrders() {
    return getCsvItems('data/orders.csv')
}

//Compare productId with te whole product.
function getProductById(productId, products) {
    let product
    products.forEach(p => {
        if (p.id == productId) {
            product = p
        }
    })

    return product
}

//Task 1 - Merge orders and total of prices
async function task1() {
    let products = await parseProducts()    //Save data products
    let orders = await parseOrders()        //Save data orders

    let result = []

    orders.forEach(order => {
        let total = 0
        let productsIds = order.products.split(" ")     //Separate products id

        productsIds.forEach(productId => {
            let product = getProductById(productId, products)
            if (product != null) {
                total += parseFloat(product.cost) //Convert product.cost to Float
            }
        })

        result.push({"id": order.id, "euros": total})
    })

    await writeCsvTask1(result)
}


async function writeCsvTask1(result) {
    const csvWriter = createCsvWriter({
        path: 'order_prices.csv',
        header: [
            {id: 'id', title: 'ORDER ID'},
            {id: 'euros', title: 'EUROS'}
        ]
    });

    await csvWriter.writeRecords(result)

    console.log(result)
}

task1()

