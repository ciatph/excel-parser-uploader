const XLSXWrapper = require('../../lib/xlsxwrapper')
const { RECOMMEDATIONS_TYPE } = require('./constants')
const { randomWords } = require('./randomwords')

/**
 * Extract normalized recommendations data and other metadata from an excel sheet tab
 * @param {Object} ExcelTab - a subclass of the ExcelTabDefinition class
 * @param {String} excelFilePath - Full file path to an excel file
 * @returns {Object} { recommendations, cropstages, farmoperations }
 *    - {Object} recommendations - crop recommendations rows of data and other metadata
 *    - {String[]} cropstages - Unique crop stages list
 *    - {String[]} farmoperations - Unique farm operations list
 */
module.exports.extractExcelData = (ExcelTab, excelFilePath) => {
  // Read the excel file
  const excel = new XLSXWrapper(excelFilePath)

  // Read sheet data from excel file
  const excelData = excel.getDataSheet(ExcelTab.excelTabNumber)

  const recommendations = {
    type: ExcelTab.type,
    description: ExcelTab.description,
    date_created: ''
  }

  // Normalize and clean cell contents
  recommendations.data = excelData.reduce((list, item, index) => {
    if (index > 0) {
      const obj = {}

      for (const key in ExcelTab.EXCEL_COLUMN_NAMES) {
        let value = item[key] || ''
        value = value.trim()

        switch (ExcelTab.type) {
          case RECOMMEDATIONS_TYPE.SEASONAL:
            // Normalize the seasonal forecast text
            if (ExcelTab.EXCEL_COLUMN_NAMES[key] === ExcelTab.NORMAL_COLUMN_NAMES.FORECAST) {
              value = ExcelTab.NORMAL_FORECAST_CODES[value]
            }

            // Change all <p> tags in NORMAL_COLUMN_NAMES.IMPACT to <li>
            if ([ExcelTab.NORMAL_COLUMN_NAMES.IMPACT, ExcelTab.NORMAL_COLUMN_NAMES.IMPACT_TAGALOG]
              .includes(ExcelTab.EXCEL_COLUMN_NAMES[key])
            ) {
              if (value.includes('<p>')) {
                value = value.replace(/<p>/g, '<li>')
                value = value.replace(/<\/p>/g, '</li>')
              }
            }
            break
          default: break
        }

        // Insert <span> in <li>
        switch (ExcelTab.EXCEL_COLUMN_NAMES[key]) {
          case ExcelTab.NORMAL_COLUMN_NAMES.PRACTICE:
          case ExcelTab.NORMAL_COLUMN_NAMES.PRACTICE_TAGALOG:
          case ExcelTab.NORMAL_COLUMN_NAMES.IMPACT:
          case ExcelTab.NORMAL_COLUMN_NAMES.IMPACT_TAGALOG:
            value = value.replace(/<li>/g, '<li><span>')
            value = value.replace(/<\/li>/g, '</span></li>')

            // Replace with random words
            if (process.env.USE_RANDOM_WORDS === '1') {
              value = randomWords(value)
            }

            break
          default:
            break
        }

        // Normalize the crop stage name - use crop calendar codes
        if (ExcelTab.EXCEL_COLUMN_NAMES[key] === ExcelTab.NORMAL_COLUMN_NAMES.CROP_STAGE) {
          value = ExcelTab.NORMAL_CROPSTAGE_CODES[value]
        }

        obj[ExcelTab.EXCEL_COLUMN_NAMES[key]] = value
      }

      obj.id = list.length
      list.push(obj)
    }

    return list
  }, [])

  // Normalize the special recommendations' farm operations
  if (ExcelTab.type === RECOMMEDATIONS_TYPE.SPECIAL) {
    recommendations.data = recommendations.data.reduce((list, item, index) => {
      const farmoperation = item[ExcelTab.NORMAL_COLUMN_NAMES.FARM_OPERATION]

      // Expand the merged farm operations vertically
      if (farmoperation.includes('/') && farmoperation !== 'Planting/Transplanting') {
        const farmoperations = farmoperation.split('/').map(operations => operations.trim())

        farmoperations.forEach((operation) => {
          const temp = { ...item }
          temp[ExcelTab.NORMAL_COLUMN_NAMES.FARM_OPERATION] = operation
          list.push(temp)
        })
      } else {
        list.push(item)
      }

      return list
    }, [])
  }

  // List unique crop stages
  const cropstages = recommendations.data.map(x => x[ExcelTab.NORMAL_COLUMN_NAMES.CROP_STAGE])
    .filter((x, i, a) => a.indexOf(x) === i)

  // List unique farm operations
  const farmoperations = recommendations.data.map(x => x[ExcelTab.NORMAL_COLUMN_NAMES.FARM_OPERATION])
    .filter((x, i, a) => a.indexOf(x) === i)

  return {
    recommendations,
    cropstages,
    farmoperations
  }
}
