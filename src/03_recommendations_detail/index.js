require('dotenv').config()
const path = require('path')
const { uploadToFirestore } = require('../lib/uploadtofirestore')
const XLSXWrapper = require('../lib/xlsxwrapper')
const { NORMAL_COLUMN_NAMES, EXCEL_COLUMN_NAMES } = require('./constants')
const { CROP_STAGE_LABELS } = require('../02_crop_calendar/constants')

// Path: /n_recommendations_details/{province}.data[]
const main = async () => {
  const filePath = path.join(__dirname, '..', '01_recommendations', process.env.EXCEL_FILENAME)

  // Read the excel file
  const excel = new XLSXWrapper(filePath)

  // Read sheet data from excel file
  const excelData = excel.getDataSheet(3)

  // Crop stage codes and full labels
  const cropStageCodes = Object.keys(CROP_STAGE_LABELS)

  // Group data by province
  const data = excelData.reduce((group, row, index) => {
    const province = row[EXCEL_COLUMN_NAMES.PROVINCE].trim()

    if (group[province] === undefined) {
      group[province] = []
    }

    const obj = {}
    for (const key in row) {
      if (key !== EXCEL_COLUMN_NAMES.PROVINCE) {
        obj[NORMAL_COLUMN_NAMES[key]] = row[key].trim()

        if (key === EXCEL_COLUMN_NAMES.CROP_STAGE) {
          obj.stage = cropStageCodes.find(x => CROP_STAGE_LABELS[x] === row[key].trim()) || ''
        }
      }
    }

    group[province].push(obj)
    return { ...group }
  }, {})

  // Upload data to Firestore
  try {
    const query = []
    let logs = ''

    for (const province in data) {
      // Logs
      logs += `${province}: ${data[province].length} items\n`

      // Upload query
      query.push(uploadToFirestore('n_recommendations_details', province, { data: data[province] }))
    }

    console.log(logs)
    console.log('Uploading data to Firestore...')
    await Promise.all(query)
    console.log('Upload success!')
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
