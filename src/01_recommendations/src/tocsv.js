const { CsvToFireStore } = require('csv-firestore')
const csvHandler = new CsvToFireStore()

module.exports.dataToCsv = (data, filePath) => {
  try {
    csvHandler.write(data, filePath)
    console.log(`Created ${filePath}\n`)
    return true
  } catch (err) {
    throw new Error(err.message)
  }
}
