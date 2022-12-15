const XLSXWrapper = require('../../lib/xlsxwrapper')

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
        obj[ExcelTab.EXCEL_COLUMN_NAMES[key]] = item[key] || ''
        obj[ExcelTab.EXCEL_COLUMN_NAMES[key]] = obj[ExcelTab.EXCEL_COLUMN_NAMES[key]].trim()
      }

      list.push(obj)
    }

    return list
  }, [])

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
