import { PRODUCT_PRICES, generateData } from './generate.js'
import { applyAllMetrics } from './metrics.js'
import { getValidateRecords, createCompanies } from './validate.js'
import { addColoredClassToEvenRows } from './coloredTable.js'
import { createTable } from './createTable.js'

const RECORDS_N = 1000

const prices = PRODUCT_PRICES

const records = generateData(RECORDS_N)

const validRecords = getValidateRecords(records)
const companies = createCompanies(validRecords)

let amountOfItemsPerPage = 10
let currentPage = 1
let totalAmountOfCompanies = companies.length
let filterCompanyName = ''

const mainNode = document.getElementById('main')

const updateTable = (currentPage, itemsPerPage, filter) => {
  const tableNode = mainNode.querySelector('table')

  if (tableNode) {
    tableNode.remove()
  }

  const filteredCompanies = companies.filter((item) => {
    const companyName = item.company.toLowerCase()
    const filterLowerCase = filter.toLowerCase()
    return (
      !filterLowerCase || (companyName && companyName.includes(filterLowerCase))
    )
  })
  const paginatedCompanies = getPaginateCompanies(
    currentPage,
    itemsPerPage,
    filteredCompanies
  )

  const table = createTable(prices, paginatedCompanies)

  const metricTable = applyAllMetrics(table, 'total')
  addColoredClassToEvenRows(metricTable)
  mainNode.insertBefore(metricTable, mainNode.firstChild)
}

const getPaginateCompanies = (currentPage, itemsPerPage, filteredCompanies) => {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex)

  return paginatedCompanies
}

const createPagination = () => {
  const pagination = document.createElement('div')
  pagination.classList.add('pagination')
  const prevBtn = document.createElement('button')
  prevBtn.classList.add('pagination-button')
  prevBtn.textContent = '< Назад'
  prevBtn.disabled = true

  const nextBtn = document.createElement('button')
  nextBtn.classList.add('pagination-button')
  nextBtn.textContent = 'Вперед >'
  nextBtn.disabled = !(
    currentPage < Math.ceil(totalAmountOfCompanies / amountOfItemsPerPage)
  )

  const amountPerPageButton = document.createElement('select')
  amountPerPageButton.classList.add('pagination-select')

  const option1 = document.createElement('option')
  option1.textContent = `10 на странице`
  option1.value = 10
  amountPerPageButton.appendChild(option1)

  const option2 = document.createElement('option')
  option2.textContent = `50 на странице`
  option2.value = 50
  amountPerPageButton.appendChild(option2)

  const option3 = document.createElement('option')
  option3.textContent = `100 на странице`
  option3.value = 100
  amountPerPageButton.appendChild(option3)

  pagination.append(prevBtn, amountPerPageButton, nextBtn)

  amountPerPageButton.addEventListener('change', (event) => {
    amountOfItemsPerPage = parseInt(event.target.value)
    updateTable(currentPage, amountOfItemsPerPage, filterCompanyName)
  })

  nextBtn.addEventListener('click', () => {
    if (
      currentPage < Math.ceil(totalAmountOfCompanies / amountOfItemsPerPage)
    ) {
      currentPage += 1
      updateTable(currentPage, amountOfItemsPerPage, filterCompanyName)
    }

    if (
      currentPage >= Math.ceil(totalAmountOfCompanies / amountOfItemsPerPage)
    ) {
      nextBtn.disabled = true
    }

    prevBtn.disabled = false
  })

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1
      updateTable(currentPage, amountOfItemsPerPage, filterCompanyName)
    }

    if (currentPage <= 1) {
      prevBtn.disabled = true
    }

    nextBtn.disabled = false
  })

  return pagination
}

const createInput = () => {
  const input = document.createElement('input')
  input.classList.add('filter')
  input.addEventListener('change', (event) => {
    filterCompanyName = event.target.value
    updateTable(currentPage, amountOfItemsPerPage, event.target.value)
  })
  return input
}

const pagination = createPagination()
const input = createInput()

updateTable(currentPage, amountOfItemsPerPage, filterCompanyName)
mainNode.append(pagination)
mainNode.append(input)
