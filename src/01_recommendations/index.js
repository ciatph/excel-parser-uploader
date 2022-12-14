require('dotenv').config()
const path = require('path')
const { FirestoreData } = require('csv-firestore')
const XLSXWrapper = require('../lib/xlsxwrapper')

// Excel file column names
const COLUMN_NAMES = {
  CROP_STAGE: 'crop_stage',
  FARM_OPERATION: 'farm_operation',
  FORECAST: 'forecast',
  IMPACT: 'impact',
  IMPACT_TAGALOG: 'impact_tagalog',
  PRACTICE: 'practice',
  PRACTICE_TAGALOG: 'practice_tagalog'
}

const EXCEL_COLUMN_NAMES = {
  'Crop Stage': COLUMN_NAMES.CROP_STAGE,
  'Farm Operation': COLUMN_NAMES.FARM_OPERATION,
  RSCOA: COLUMN_NAMES.FORECAST,
  __EMPTY: COLUMN_NAMES.IMPACT,
  __EMPTY_1: COLUMN_NAMES.IMPACT_TAGALOG,
  __EMPTY_2: COLUMN_NAMES.PRACTICE,
  __EMPTY_3: COLUMN_NAMES.PRACTICE_TAGALOG
  // '__EMPTY_4': SMS,
}

const main = async () => {
  // Excel file path
  const filePath = path.join(__dirname, process.env.EXCEL_FILENAME)
  const excel = new XLSXWrapper(filePath)

  // CSV and Firestore handler
  const firestore = new FirestoreData()

  // Read data from excel file
  const seasonalData = excel.getDataSheet(0)

  const jsonData = {
    type: 'seasonal',
    description: 'Seasonal Crop Recommendations',
    date_created: firestore.admin.firestore.Timestamp.now()
  }

  // Normalize, clean and convert list text content to HTML tags
  jsonData.data = seasonalData.reduce((list, item, index) => {
    if (index > 0) {
      const obj = {}

      for (const key in EXCEL_COLUMN_NAMES) {
        obj[EXCEL_COLUMN_NAMES[key]] = item[key] || ''
      }

      list.push(obj)
    }

    return list
  }, [])

  try {
    // Upload data to Firestore
    const docRef = await firestore.db
      .collection('n_list_crop_recommendations')
      .doc('seasonal')
      .set(jsonData)

    console.log(docRef)
    process.exit(0)
  } catch (err) {
    console.log(`[ERROR]: ${err.message}`)
    process.exit(1)
  }
}

main()
