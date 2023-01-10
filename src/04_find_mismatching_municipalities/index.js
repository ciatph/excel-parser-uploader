const path = require('path')
const CroppingCalendar = require('../02_crop_calendar/cropping_calendar')

/**
 * Creates a list of mismatching municipality names from the cropping calendar and PAGASA 10-day weather forecast excel file.
 * Requires the cropping calendar CSV file and 1 of PAGASA's 10-day weather forecast EXCEL file.
 */
const main = async () => {
  const handler = new CroppingCalendar(path.resolve(__dirname, '..', '02_crop_calendar', process.env.CSV_FILENAME))
  const write = true

  // Cropping Calendar-specific tables and firestore collection names
  const newTables = {
    provinces: 'n_provinces',
    municipalities: 'n_municipalities',
    crops: 'n_crops',
    crop_stages: 'n_crop_stages'
  }

  try {
    console.log('Reading CSV...')
    await handler.readCSV()

    if (write) {
      // Write cropping calendar data to CSV files
      console.log('\nWriting data to CSV...')
      handler.write(handler.data(), path.resolve(__dirname, 'data.csv'))

      for (const collection in newTables) {
        handler.write(
          (collection === 'municipalities')
            ? handler[collection].map(x => ({ id: x.id, province: x.province, name: x.name }))
            : handler[collection],
          path.resolve(__dirname, `${newTables[collection]}.csv`
          ))

        console.log(`${collection}: ${handler[collection].length}`)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

main()