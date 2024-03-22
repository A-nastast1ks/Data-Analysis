export function getValidateRecords(records) {
  return records.filter(
    (record) => record.company && record.product && record.count > 0
  )
}

export function createCompanies(validRecords) {
  const productsMap = new Map()

  for (let i = 0; i < validRecords.length; i++) {
    const { company, product, count } = validRecords[i]

    if (productsMap.has(company)) {
      const companyProducts = productsMap.get(company)
      if (companyProducts.hasOwnProperty(product)) {
        companyProducts[product] += count
      } else {
        companyProducts[product] = count
      }
    } else {
      productsMap.set(company, { [product]: count })
    }
  }

  const productsArray = Array.from(productsMap, ([company, products]) => {
    return {
      company,
      products,
    }
  })

  return productsArray
}
