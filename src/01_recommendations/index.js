require('dotenv').config()
const path = require('path')
const SeasonalTab = require('./classes/seasonaltab')
const TendayTab = require('./classes/tendaytab')
const SpecialTab = require('./classes/specialtab')
const { uploadToFirestore } = require('../lib/uploadtofirestore')
const { extractExcelData } = require('./extract')

const main = async () => {
  const data = []
  const query = []

  // Excel file path
  const filePath = path.join(__dirname, process.env.EXCEL_FILENAME)

  // Excel tabs column names definitions
  const excelTabs = [
    new SeasonalTab(),
    new TendayTab(),
    new SpecialTab()
  ]

  try {
    // Extract data from excel sheet tabs
    console.log('Extracting data from excel sheets...')

    excelTabs.forEach((item, index) => {
      data.push(extractExcelData(item, filePath))
      query.push(uploadToFirestore('n_list_crop_recommendations', item.type, data[index].recommendations))
    })
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
    process.exit(1)
  }

  try {
    // Upload data to Firestore
    let logs = 'Extracted data:\n'
    data.forEach(item => {
      logs += `${item.recommendations.type}: ${item.recommendations.data.length} rows\n`
    })

    console.log(`${logs}\nUploading data to Firestore...`)
    await Promise.all(query)
    console.log('Data upload success!')
    process.exit(0)
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
