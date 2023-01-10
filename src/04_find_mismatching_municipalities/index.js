const path = require('path')
const { CsvToFireStore } = require('csv-firestore')
const { municipalitiesFromCalendar } = require('./src/calendar')
const { municipalitiesFromForecast } = require('./src/forecast')

/**
 * Creates a list of mismatching municipality names from the cropping calendar and PAGASA 10-day weather forecast excel file.
 * Requires the cropping calendar CSV file and 1 of PAGASA's 10-day weather forecast EXCEL file.
 */
const main = async () => {
  // Read the cropping calendar file
  const { municipalities: calendarMunicipalities } = await municipalitiesFromCalendar(path.join(__dirname, '..', '02_crop_calendar', process.env.CSV_FILENAME))

  // PAGASA municipalities
  const { municipalities: forecastMunicipalities } = municipalitiesFromForecast(path.join(__dirname, process.env.EXCEL_FILENAME))

  const handler = new CsvToFireStore()

  try {
    // Find municipalities in calendarMunicipalities that are not available in forecastMunicipalities
    const mismatchingNames = calendarMunicipalities.reduce((list, item) => {
      if (!forecastMunicipalities.find(x => x.province === item.province &&
        x.municipality === item.municipality)
      ) {
        list.push(item)
      }

      return list
    }, [])

    console.log(mismatchingNames)
    handler.write(mismatchingNames, path.join(__dirname, 'municipalities.csv'))
  } catch (err) {
    console.log(err)
  }
}

main()
