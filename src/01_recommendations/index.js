require('dotenv').config()
const path = require('path')
const XLSXWrapper = require('../lib/xlsxwrapper')
const StringListToHTML = require('../lib/stringlisttohtml')

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

const main = () => {
  // Excel file path
  const filePath = path.join(__dirname, process.env.EXCEL_FILENAME)

  const excel = new XLSXWrapper(filePath)
  const textToHTML = new StringListToHTML()

  // Read data from excel file
  const seasonalData = excel.getDataSheet(0)

  // Normalize, clean and convert list text content to HTML tags
  const data = seasonalData.reduce((list, item, index) => {
    const t = Object.values(item)
    if (index > 0) {
      list.push({
        [COLUMN_NAMES.CROP_STAGE]: t[0],
        [COLUMN_NAMES.FARM_OPERATION]: t[1],
        [COLUMN_NAMES.FORECAST]: t[2],
        [COLUMN_NAMES.IMPACT]: textToHTML.convert(t[3]),
        [COLUMN_NAMES.IMPACT_TAGALOG]: textToHTML.convert(t[4]),
        [COLUMN_NAMES.PRACTICE]: textToHTML.convert(t[5]),
        [COLUMN_NAMES.PRACTICE_TAGALOG]: textToHTML.convert(t[6])
      })
    }
    return list
  }, [])

  console.log(data)
}

main()
