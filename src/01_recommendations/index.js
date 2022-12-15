require('dotenv').config()
const path = require('path')
const SeasonalTab = require('./src/classes/seasonaltab')
const TendayTab = require('./src/classes/tendaytab')
const SpecialTab = require('./src/classes/specialtab')
const { uploadToFirestore } = require('../lib/uploadtofirestore')
const { extractExcelData } = require('./src/extract')
const { dataToCsv } = require('./src/tocsv')

// Path: /n_list_crop_recommendations/{type}.data[]
const main = async () => {
  const data = []
  const query = []
  const upload = false

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
    })
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
    process.exit(1)
  }

  // Write unique crop stages to CSV
  const uniqueStages = [...data[0].cropstages, ...data[1].cropstages, ...data[2].cropstages]
    .filter((x, i, a) => a.indexOf(x) === i)
    .reduce((list, item, index) => {
      list.push({ id: index + 1, name: item })
      return list
    }, [])

  // Write unique farm operations to CSV
  const uniqueActivities = [...data[0].farmoperations, ...data[1].farmoperations, ...data[2].farmoperations]
    .filter((x, i, a) => a.indexOf(x) === i)
    .reduce((list, item, index) => {
      list.push({ id: index + 1, name: item })
      return list
    }, [])

  dataToCsv(uniqueStages, path.join(__dirname, 'crop_stages.csv'))
  dataToCsv(uniqueActivities, path.join(__dirname, 'farm_operations.csv'))

  if (upload) {
    try {
      data.forEach((item, index) => {
        query.push(uploadToFirestore('n_list_crop_recommendations', item.recommendations.type, item.recommendations))
      })

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
}

main()
