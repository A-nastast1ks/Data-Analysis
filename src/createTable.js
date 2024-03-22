import { TOTAL_VALUE_NAME } from './metrics.js'

const RECORD_COUNT = '(шт.)'
const COMPANY_NAME = 'Компания'

const PRICE_CURRENCY = '(руб.)'

const TOTAL_PRICE_COMPANY_NAME = `${TOTAL_VALUE_NAME} ${PRICE_CURRENCY}`

const createHeaderOfTable = (productsNames) => {
  const tableHeader = [COMPANY_NAME]
  productsNames.forEach((product) => {
    tableHeader.push(`${product} ${RECORD_COUNT}`)
    tableHeader.push(`${product} ${PRICE_CURRENCY}`)
  })
  tableHeader.push(TOTAL_PRICE_COMPANY_NAME)

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  tableHeader.forEach((headerText) => {
    const headerCell = document.createElement('th')
    headerCell.textContent = headerText
    headerRow.append(headerCell)
  })
  thead.append(headerRow)
  return thead
}

const createRowsOfTable = (companies, prices, productsNames) => {
  const tbody = document.createElement('tbody')

  companies.forEach((productData) => {
    const { company, products } = productData
    const row = document.createElement('tr')

    const companyCell = document.createElement('td')
    companyCell.textContent = company
    row.append(companyCell)
    let totalPrice = 0

    productsNames.forEach((productName) => {
      const count = products[productName] || '-'
      const price = prices[productName]

      const countCell = document.createElement('td')
      countCell.textContent = count
      row.append(countCell)

      const priceCell = document.createElement('td')
      if (count !== '-') {
        priceCell.textContent = Math.floor(price * count)
        totalPrice += Math.floor(price * count)
      } else {
        priceCell.textContent = '-'
      }
      row.append(priceCell)
    })

    const totalPriceCell = document.createElement('td')
    totalPriceCell.textContent = totalPrice === 0 ? '-' : totalPrice
    row.append(totalPriceCell)

    tbody.append(row)
  })

  return tbody
}

export const createTable = (prices, companies) => {
  const table = document.createElement('table')

  const productsNames = Object.keys(prices)

  const headerOfTable = createHeaderOfTable(productsNames)
  const bodyOfTable = createRowsOfTable(companies, prices, productsNames)

  table.append(headerOfTable)
  table.append(bodyOfTable)

  return table
}
