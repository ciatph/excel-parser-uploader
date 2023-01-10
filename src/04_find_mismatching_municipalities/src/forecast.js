const XLSXWrapper = require('../../lib/xlsxwrapper')

/**
 * Extracts the municipalities with province list from a 10-day weather forecast excel file
 * @param {String} filepath - Full file path to an EXCEL file
 * @returns {Object[]} List of municipalities
 */
module.exports.municipalitiesFromForecast = (filepath) => {
  // Read the excel file
  const tendayForecastFile = new XLSXWrapper(filepath)
  const tendayForecastData = tendayForecastFile.getDataSheet(0)
  const bicolProvinces = ['Albay', 'Camarines Norte', 'Camarines Sur', 'Catanduanes', 'Masbate', 'Sorsogon']

  const municipalities = tendayForecastData
    .filter(x => (x.__EMPTY !== undefined && bicolProvinces.find(y => x.__EMPTY.toString().includes(y))))
    .map((x, id) => {
      const province = bicolProvinces.find(y => x.__EMPTY.toString().includes(y))
      return {
        id,
        province,
        municipality: x.__EMPTY.toString().split(`(${province})`)[0].trim()
      }
    })

  return { municipalities }
}
