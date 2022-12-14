require('dotenv').config()
const path = require('path')
const CroppingCalendar = require('./cropping_calendar')

// Path: /n_cropping_calendar_merged
const main = async () => {
  const handler = new CroppingCalendar(path.resolve(__dirname, process.env.CSV_FILENAME))
  const upload = false
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

    if (upload) {
      console.log('\nUploading data to firestore...')
      const query = [handler.firestoreUpload('n_cropping_calendar_merged')]

      for (const collection in newTables) {
        query.push(handler.firestoreUpload(
          newTables[collection],
          true,
          (collection === 'municipalities')
            ? handler[collection].map(x => ({ id: x.id, province: x.province, name: x.name }))
            : handler[collection]
        ))
      }

      await Promise.all(query)
    }

    if (write) {
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

    console.log('\n------------------------------\nProcessing finished. Stats:')
    console.log(`cropping calendar: ${handler.data().length}`)

    console.log('\n')
  } catch (err) {
    console.log(err)
  }
}

(async () => {
  await main()
})()
