export const TOTAL_VALUE_NAME = 'Итого'
const MAX_VALUE_NAME = 'Максимум'
const AVERAGE_VALUE_NAME = 'Среднее'
const MIN_VALUE_NAME = 'Минимум'
const MEDIAN_VALUE_NAME = 'Медиана'

const NAME_OF_METRICS = ['total', 'average', 'max', 'min', 'median']

export const applyAllMetrics = (table) => {
  let modifiedTable = table

  for (const metric of NAME_OF_METRICS) {
    modifiedTable = applyMetrics(modifiedTable, metric)
  }

  return modifiedTable
}

const applyMetrics = (table, nameOfMetric) => {
  switch (nameOfMetric) {
    case 'min': {
      return addMinMetric(table)
    }
    case 'max': {
      return addMaxMetric(table)
    }
    case 'total': {
      return addTotalMetric(table)
    }
    case 'average': {
      return addAverageMetric(table)
    }
    case 'median': {
      return addMedianMetric(table)
    }

    default: {
      return table
    }
  }
}
const addMinMetric = (table) => {
  const thead = table.children[0]
  const tbody = table.children[1]

  const minRow = document.createElement('tr')

  const columnsCount = thead.children[0].children.length

  for (let i = 0; i < columnsCount; i++) {
    const minCell = document.createElement('td')
    if (i === 0) {
      minCell.textContent = MIN_VALUE_NAME
      minCell.classList.add('metric-text')
    } else {
      let minValue = Number.MAX_VALUE
      for (let j = 0; j < tbody.children.length; j++) {
        const cellValue = parseFloat(tbody.children[j].children[i].textContent)
        if (!isNaN(cellValue) && cellValue < minValue) {
          minValue = cellValue
        }
      }
      minCell.textContent = minValue !== Number.MAX_VALUE ? minValue : '-'
    }
    minRow.appendChild(minCell)
  }

  table.appendChild(minRow)
  return table
}

const addAverageMetric = (table) => {
  const thead = table.children[0]
  const tbody = table.children[1]

  const averageRow = document.createElement('tr')

  const columnsCount = thead.children[0].children.length

  for (let i = 0; i < columnsCount; i++) {
    const averageCell = document.createElement('td')
    if (i === 0) {
      averageCell.textContent = AVERAGE_VALUE_NAME
      averageCell.classList.add('metric-text')
    } else {
      let sum = 0
      let count = 0
      for (let j = 0; j < tbody.children.length; j++) {
        const cellValue = parseFloat(tbody.children[j].children[i].textContent)
        if (!isNaN(cellValue)) {
          sum += cellValue
          count++
        }
      }
      const averageValue = count > 0 ? (sum / count).toFixed(2) : '-'
      averageCell.textContent = averageValue
    }
    averageRow.append(averageCell)
  }

  table.append(averageRow)
  return table
}
const addTotalMetric = (table) => {
  const thead = table.children[0]
  const tbody = table.children[1]

  const totalRow = document.createElement('tr')

  const columnsCount = thead.children[0].children.length

  for (let i = 0; i < columnsCount; i++) {
    const totalCell = document.createElement('td')

    if (i === 0) {
      totalCell.textContent = TOTAL_VALUE_NAME
      totalCell.classList.add('metric-text')
    } else {
      let sum = 0
      for (let j = 0; j < tbody.children.length; j++) {
        const cellValue = parseFloat(tbody.children[j].children[i].textContent)
        if (!isNaN(cellValue)) {
          sum += cellValue
        }
      }
      totalCell.textContent = sum
    }
    totalRow.append(totalCell)
  }

  table.append(totalRow)
  return table
}

const addMaxMetric = (table) => {
  const thead = table.children[0]
  const tbody = table.children[1]

  const maxRow = document.createElement('tr')

  const columnsCount = thead.children[0].children.length

  for (let i = 0; i < columnsCount; i++) {
    const maxCell = document.createElement('td')
    if (i === 0) {
      maxCell.textContent = MAX_VALUE_NAME
      maxCell.classList.add('metric-text')
    } else {
      let maxValue = Number.MIN_VALUE
      for (let j = 0; j < tbody.children.length; j++) {
        const cellValue = parseFloat(tbody.children[j].children[i].textContent)
        if (!isNaN(cellValue) && cellValue > maxValue) {
          maxValue = cellValue
        }
      }
      maxCell.textContent = maxValue !== Number.MIN_VALUE ? maxValue : '-'
    }
    maxRow.append(maxCell)
  }

  table.append(maxRow)
  return table
}

const addMedianMetric = (table) => {
  const thead = table.children[0]
  const tbody = table.children[1]

  const medianRow = document.createElement('tr')

  const columnsCount = thead.children[0].children.length

  for (let i = 0; i < columnsCount; i++) {
    const medianCell = document.createElement('td')
    if (i === 0) {
      medianCell.textContent = MEDIAN_VALUE_NAME
      medianCell.classList.add('metric-text')
    } else {
      const columnValues = []
      for (let j = 0; j < tbody.children.length; j++) {
        const cellValue = parseFloat(tbody.children[j].children[i].textContent)
        if (!isNaN(cellValue)) {
          columnValues.push(cellValue)
        }
      }
      const sortedValues = columnValues.sort((a, b) => a - b)
      const medianValue = calculateMedian(sortedValues)
      medianCell.textContent = medianValue !== null ? medianValue : '-'
    }
    medianRow.appendChild(medianCell)
  }

  table.appendChild(medianRow)
  return table
}
const calculateMedian = (values) => {
  const count = values.length
  if (count === 0) {
    return null
  }

  const middleIndex = Math.floor(count / 2)

  if (count % 2 === 0) {
    const median = (values[middleIndex - 1] + values[middleIndex]) / 2
    return median.toFixed(2)
  } else {
    return values[middleIndex].toFixed(2)
  }
}
