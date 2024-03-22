export const addColoredClassToEvenRows = (table) => {
  const rows = table.getElementsByTagName('tr')

  for (let i = 0; i < rows.length; i++) {
    if (i % 2 === 1) {
      rows[i].classList.add('colored')
    }
  }
}
