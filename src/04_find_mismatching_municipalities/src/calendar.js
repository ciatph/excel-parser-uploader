const CroppingCalendar = require('../../02_crop_calendar/cropping_calendar')

/**
 * Extracts the municipalities with province list from the cropping calendar
 * @param {String} filepath - Full file path to a CSV file
 * @returns {Object[]} List of municipalities
 */
module.exports.municipalitiesFromCalendar = async (filepath) => {
  try {
    // Read the cropping calendar file
    const cropCalendarData = new CroppingCalendar(filepath)

    await cropCalendarData.readCSV()
    const municipalities = cropCalendarData.municipalities.map(x => ({ id: x.id, province: x.province, municipality: x.name }))

    return { municipalities }
  } catch (err) {
    throw new Error(err.message)
  }
}
