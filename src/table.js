import {
  getAverage,
  getMaximum,
  getMaxSum,
  getFullPrice,
  getMinimum,
  getFullPriceForExtraRows,
} from './product-helper.js'
import { PRODUCT_PRICES } from './generate.js'

function createKeyValueTd(firstTdTitle, secondTdTitle, tr) {
  let firstTd = document.createElement('td')
  let secondTd = document.createElement('td')
  firstTd.appendChild(document.createTextNode(firstTdTitle || '-'))
  secondTd.appendChild(document.createTextNode(secondTdTitle || '-'))
  tr.appendChild(firstTd)
  tr.appendChild(secondTd)
}

function createTitle(title, tr, isTh) {
  let td = document.createElement(isTh ? 'th' : 'td')
  td.appendChild(document.createTextNode(title))
  tr.appendChild(td)
}

function getHeader(onSort, sortMap) {
  let thead = document.createElement('thead')
  let headerTr = document.createElement('tr')

  let productNameTh = document.createElement('th')
  productNameTh.appendChild(document.createTextNode('Company Name'))
  productNameTh.setAttribute('rowSpan', 2)
  if (sortMap['name']) {
    productNameTh.appendChild(
      document.createTextNode(sortMap['name'] > 0 ? '↑' : '↓')
    )
  }
  productNameTh.addEventListener('click', (event) => {
    onSort('name')
  })

  headerTr.appendChild(productNameTh)
  const productsName = Object.keys(PRODUCT_PRICES)
  let headerSecondTr = document.createElement('tr')

  productsName.forEach((value) => {
    let productTh = document.createElement('th')

    productTh.setAttribute('colSpan', 2)
    productTh.appendChild(document.createTextNode(value))
    if (sortMap[value]) {
      productTh.appendChild(
        document.createTextNode(sortMap[value] > 0 ? '↑' : '↓')
      )
    }
    productTh.setAttribute('id', value)
    productTh.addEventListener('click', (event) => {
      onSort(event.target.id)
    })
    createTitle('Сумма: ', headerSecondTr, true)
    createTitle(`Цена базовая: ${PRODUCT_PRICES[value]}`, headerSecondTr, true)

    headerTr.appendChild(productTh)
  })
  createTitle('Итого', headerTr, true)
  createTitle('', headerSecondTr)

  thead.appendChild(headerTr)
  thead.appendChild(headerSecondTr)

  return thead
}
// max и min не считает сумму в хелпере, поэтому считаем здесь
function getExtraRows(data) {
  const extraRowsInfo = {
    max: getMaxSum(data),
    average: getAverage(data),
    maximum: getMaximum(data),
    minimum: getMinimum(data),
  }
  const extraRowsMap = {
    max: 'Общее',
    average: 'Среднее',
    maximum: 'Максимальное',
    minimum: 'Минимальное',
  }
  const extraRows = getFullPriceForExtraRows(extraRowsInfo)
  const extraTrs = []
  Object.keys(extraRowsInfo).forEach((extraRow) => {
    let extraTr = document.createElement('tr')
    createTitle(extraRowsMap[extraRow], extraTr)
    const extraRowProductInfo = extraRowsInfo[extraRow]
    Object.keys(PRODUCT_PRICES).forEach((price) => {
      createKeyValueTd(
        extraRowProductInfo[price],
        extraRowProductInfo[price] * PRODUCT_PRICES[price],
        extraTr
      )
    })
    createTitle(extraRows[extraRow], extraTr)
    extraTrs.push(extraTr)
  })

  return extraTrs
}

export function drawTable(data, onSort, sortMap) {
  let tbl = document.getElementById('table')
  tbl.innerHTML = ''
  tbl.style.width = '100%'
  tbl.setAttribute('border', '1')
  let tbdy = document.createElement('tbody')
  const fullPrice = getFullPrice(data)

  const companies = Object.keys(data)
  const productsName = Object.keys(PRODUCT_PRICES)

  companies.forEach((company) => {
    let tr = document.createElement('tr')
    createTitle(company, tr)

    productsName.forEach((product) => {
      const productItem = data[company][product]
      const price = +(productItem * PRODUCT_PRICES[product]).toFixed(2)
      createKeyValueTd(productItem, price, tr)
    })
    createTitle(fullPrice[company], tr)

    tbdy.appendChild(tr)
  })

  const extraTrs = getExtraRows(data)
  extraTrs.forEach((tr) => {
    tbdy.appendChild(tr)
  })

  tbl.appendChild(getHeader(onSort, sortMap))
  tbl.appendChild(tbdy)
}
